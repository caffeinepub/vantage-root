import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Order "mo:core/Order";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type Priority = { #low; #medium; #high };
  type Status = { #new_; #inProgress; #completed };

  type ConsultationRequest = {
    id : Nat;
    name : Text;
    email : Text;
    phone : ?Text;
    balconySize : BalconySize;
    sunlightExposure : SunlightExposure;
    stylePreference : StylePreference;
    message : Text;
    timestamp : Time.Time;
    priority : Priority;
    status : Status;
  };

  module ConsultationRequest {
    public func compare(a : ConsultationRequest, b : ConsultationRequest) : Order.Order {
      Nat.compare(b.id, a.id);
    };
  };

  type BalconySize = { #small; #medium; #large };
  type SunlightExposure = { #fullSun; #partialShade; #fullShade };
  type StylePreference = { #modern; #natural; #tropical; #minimalist };

  public type UserProfile = {
    name : Text;
  };

  // Data stores
  let requests = Map.empty<Nat, ConsultationRequest>();
  var currentId = 0;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Public consultation request functions without authorization checks
  public shared ({ caller }) func submitConsultationRequest(
    name : Text,
    email : Text,
    phone : ?Text,
    balconySize : BalconySize,
    sunlightExposure : SunlightExposure,
    stylePreference : StylePreference,
    message : Text,
  ) : async Bool {
    let request : ConsultationRequest = {
      id = currentId;
      name;
      email;
      phone;
      balconySize;
      sunlightExposure;
      stylePreference;
      message;
      timestamp = Time.now();
      priority = #medium;
      status = #new_; // New requests default to "new_"
    };
    requests.add(currentId, request);
    currentId += 1;
    true;
  };

  public query ({ caller }) func getAllConsultationRequests() : async [ConsultationRequest] {
    let allRequests = List.empty<ConsultationRequest>();
    for (request in requests.values()) {
      allRequests.add(request);
    };
    allRequests.reverse().toArray().sort();
  };

  public query ({ caller }) func getConsultationRequestCount() : async Nat {
    requests.size();
  };

  public shared ({ caller }) func deleteConsultationRequest(id : Nat) : async Bool {
    switch (requests.get(id)) {
      case (null) { false };
      case (?_request) {
        requests.remove(id);
        true;
      };
    };
  };

  public shared ({ caller }) func updateRequestPriority(id : Nat, priority : Priority) : async Bool {
    switch (requests.get(id)) {
      case (null) { false };
      case (?request) {
        let updatedRequest = { request with priority };
        requests.add(id, updatedRequest);
        true;
      };
    };
  };

  public shared ({ caller }) func updateRequestStatus(id : Nat, status : Status) : async Bool {
    switch (requests.get(id)) {
      case (null) { false };
      case (?request) {
        let updatedRequest = { request with status };
        requests.add(id, updatedRequest);
        true;
      };
    };
  };
};
