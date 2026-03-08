import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  // Old types
  type OldConsultationRequest = {
    id : Nat;
    name : Text;
    email : Text;
    phone : ?Text;
    balconySize : { #small; #medium; #large };
    sunlightExposure : { #fullSun; #partialShade; #fullShade };
    stylePreference : { #modern; #natural; #tropical; #minimalist };
    message : Text;
    timestamp : Time.Time;
    priority : { #low; #medium; #high };
    status : { #new_; #inProgress; #completed };
  };

  type OldActor = {
    requests : Map.Map<Nat, OldConsultationRequest>;
    currentId : Nat;
    userProfiles : Map.Map<Principal, { name : Text }>;
    sessions : Map.Map<Text, { token : Text; deviceInfo : Text; timezone : Text; loginTime : Int; ipHint : Text }>;
    blocklist : Map.Map<Text, ()>;
  };

  // New types
  type NewActor = {
    requests : Map.Map<Nat, OldConsultationRequest>;
    currentId : Nat;
    userProfiles : Map.Map<Principal, { name : Text }>;
    sessions : Map.Map<Text, { token : Text; deviceInfo : Text; timezone : Text; loginTime : Int; ipHint : Text }>;
    blocklist : Map.Map<Text, ()>;
    customers : Map.Map<Nat, { id : Nat; fullName : Text; email : Text; passwordHash : Text; phone : Text; addressLine : Text; city : Text; state : Text; country : Text; pincode : Text; createdAt : Time.Time }>;
    currentCustomerId : Nat;
    customerSessions : Map.Map<Text, { token : Text; customerId : Nat; email : Text; createdAt : Time.Time }>;
    newsletterSubs : Map.Map<Text, { email : Text; subscribedAt : Time.Time }>;
  };

  public func run(old : OldActor) : NewActor {
    // Initialize new maps for customers, sessions, and newsletter
    let emptyCustomers = Map.empty<Nat, { id : Nat; fullName : Text; email : Text; passwordHash : Text; phone : Text; addressLine : Text; city : Text; state : Text; country : Text; pincode : Text; createdAt : Time.Time }>();
    let emptyCustomerSessions = Map.empty<Text, { token : Text; customerId : Nat; email : Text; createdAt : Time.Time }>();
    let emptyNewsletterSubs = Map.empty<Text, { email : Text; subscribedAt : Time.Time }>();

    {
      old with
      customers = emptyCustomers;
      currentCustomerId = 0;
      customerSessions = emptyCustomerSessions;
      newsletterSubs = emptyNewsletterSubs;
    };
  };
};
