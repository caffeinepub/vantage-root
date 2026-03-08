import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Order "mo:core/Order";
import List "mo:core/List";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
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

  public type SessionInfo = {
    token : Text;
    deviceInfo : Text;
    timezone : Text;
    loginTime : Int;
    ipHint : Text;
  };

  // New types for customer user, sessions, and newsletter
  public type CustomerUser = {
    id : Nat;
    fullName : Text;
    email : Text;
    passwordHash : Text;
    phone : Text;
    addressLine : Text;
    city : Text;
    state : Text;
    country : Text;
    pincode : Text;
    createdAt : Time.Time;
  };

  public type CustomerSession = {
    token : Text;
    customerId : Nat;
    email : Text;
    createdAt : Time.Time;
  };

  public type NewsletterSubscription = {
    email : Text;
    subscribedAt : Time.Time;
  };

  // Vendor application types
  public type VendorApplicationStatus = {
    #pending;
    #approved;
    #rejected;
  };

  public type VendorApplication = {
    id : Nat;
    businessName : Text;
    businessType : Text;
    yearsInBusiness : Text;
    businessDescription : Text;
    ownerName : Text;
    email : Text;
    phone : Text;
    addressLine : Text;
    city : Text;
    state : Text;
    country : Text;
    pincode : Text;
    productTypes : Text;
    categories : Text;
    approxProducts : Text;
    gstNumber : Text;
    offersShipping : Bool;
    offersLocalDelivery : Bool;
    serviceableAreas : Text;
    status : VendorApplicationStatus;
    submittedAt : Time.Time;
  };

  // Data stores
  let requests = Map.empty<Nat, ConsultationRequest>();
  var currentId = 0;

  let customers = Map.empty<Nat, CustomerUser>();
  var currentCustomerId = 0;

  let customerSessions = Map.empty<Text, CustomerSession>();
  let newsletterSubs = Map.empty<Text, NewsletterSubscription>();

  let vendorApplications = Map.empty<Nat, VendorApplication>();
  var currentVendorId = 0;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();
  let sessions = Map.empty<Text, SessionInfo>();
  let blocklist = Map.empty<Text, ()>();

  // Helper functions for password and token handling
  func hashPassword(password : Text) : Text {
    "plantly_v1:" # password;
  };

  func generateToken(email : Text, timestamp : Time.Time) : Text {
    "tok_" # email # "_" # debug_show (timestamp);
  };

  // Customer account functions
  public shared ({ caller }) func signupCustomer(
    fullName : Text,
    email : Text,
    password : Text,
    phone : Text,
    addressLine : Text,
    city : Text,
    state : Text,
    country : Text,
    pincode : Text,
  ) : async {
    #ok : Nat;
    #err : Text;
  } {
    let existing = customers.values().find(func(c) { c.email == email });
    switch (existing) {
      case (?_) { #err("Email already exists") };
      case (null) {
        let customer : CustomerUser = {
          id = currentCustomerId;
          fullName;
          email;
          passwordHash = hashPassword(password);
          phone;
          addressLine;
          city;
          state;
          country;
          pincode;
          createdAt = Time.now();
        };
        customers.add(currentCustomerId, customer);
        currentCustomerId += 1;
        #ok(customer.id);
      };
    };
  };

  public shared ({ caller }) func loginCustomer(email : Text, password : Text) : async {
    #ok : Text;
    #err : Text;
  } {
    let userOpt = customers.values().find(func(c) { c.email == email });
    switch (userOpt) {
      case (null) { #err("User not found") };
      case (?user) {
        if (user.passwordHash != hashPassword(password)) {
          return #err("Incorrect password");
        };
        let token = generateToken(email, Time.now());
        let session : CustomerSession = {
          token;
          customerId = user.id;
          email;
          createdAt = Time.now();
        };
        customerSessions.add(token, session);
        #ok(token);
      };
    };
  };

  public shared ({ caller }) func logoutCustomer(token : Text) : async Bool {
    switch (customerSessions.get(token)) {
      case (null) { false };
      case (?_session) {
        customerSessions.remove(token);
        true;
      };
    };
  };

  public query ({ caller }) func getCustomerProfile(token : Text) : async ?CustomerUser {
    switch (customerSessions.get(token)) {
      case (null) { null };
      case (?session) {
        customers.get(session.customerId);
      };
    };
  };

  public shared ({ caller }) func updateCustomerProfile(
    token : Text,
    fullName : Text,
    phone : Text,
    addressLine : Text,
    city : Text,
    state : Text,
    country : Text,
    pincode : Text,
  ) : async Bool {
    switch (customerSessions.get(token)) {
      case (null) { false };
      case (?session) {
        switch (customers.get(session.customerId)) {
          case (null) { false };
          case (?customer) {
            let updated = {
              customer with
              fullName;
              phone;
              addressLine;
              city;
              state;
              country;
              pincode;
            };
            customers.add(customer.id, updated);
            true;
          };
        };
      };
    };
  };

  public shared ({ caller }) func changeCustomerPassword(
    token : Text,
    oldPassword : Text,
    newPassword : Text,
  ) : async {
    #ok;
    #err : Text;
  } {
    switch (customerSessions.get(token)) {
      case (null) { #err("Invalid session") };
      case (?session) {
        switch (customers.get(session.customerId)) {
          case (null) { #err("Customer not found") };
          case (?customer) {
            if (customer.passwordHash != hashPassword(oldPassword)) {
              return #err("Incorrect old password");
            };
            let updated = { customer with passwordHash = hashPassword(newPassword) };
            customers.add(customer.id, updated);
            #ok;
          };
        };
      };
    };
  };

  public shared ({ caller }) func subscribeNewsletter(email : Text) : async Bool {
    switch (newsletterSubs.get(email)) {
      case (?_) { false };
      case (null) {
        let sub : NewsletterSubscription = {
          email;
          subscribedAt = Time.now();
        };
        newsletterSubs.add(email, sub);
        true;
      };
    };
  };

  public shared ({ caller }) func unsubscribeNewsletter(email : Text) : async Bool {
    switch (newsletterSubs.get(email)) {
      case (null) { false };
      case (?_) {
        newsletterSubs.remove(email);
        true;
      };
    };
  };

  public query ({ caller }) func getNewsletterSubscribers() : async [NewsletterSubscription] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view newsletter subscribers");
    };
    newsletterSubs.values().toArray();
  };

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

  // Public consultation request functions - guests can submit, admins can manage
  public shared ({ caller }) func submitConsultationRequest(
    name : Text,
    email : Text,
    phone : ?Text,
    balconySize : BalconySize,
    sunlightExposure : SunlightExposure,
    stylePreference : StylePreference,
    message : Text,
  ) : async Bool {
    // No authorization check - anyone including guests can submit consultation requests
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
      status = #new_;
    };
    requests.add(currentId, request);
    currentId += 1;
    true;
  };

  public query ({ caller }) func getAllConsultationRequests() : async [ConsultationRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all consultation requests");
    };
    requests.values().toArray();
  };

  public query ({ caller }) func getConsultationRequestCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view consultation request count");
    };
    requests.size();
  };

  public shared ({ caller }) func deleteConsultationRequest(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete consultation requests");
    };
    switch (requests.get(id)) {
      case (null) { false };
      case (?_request) {
        requests.remove(id);
        true;
      };
    };
  };

  public shared ({ caller }) func updateRequestPriority(id : Nat, priority : Priority) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update request priority");
    };
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update request status");
    };
    switch (requests.get(id)) {
      case (null) { false };
      case (?request) {
        let updatedRequest = { request with status };
        requests.add(id, updatedRequest);
        true;
      };
    };
  };

  // Vendor application functions
  public shared ({ caller }) func submitVendorApplication(
    businessName : Text,
    businessType : Text,
    yearsInBusiness : Text,
    businessDescription : Text,
    ownerName : Text,
    email : Text,
    phone : Text,
    addressLine : Text,
    city : Text,
    state : Text,
    country : Text,
    pincode : Text,
    productTypes : Text,
    categories : Text,
    approxProducts : Text,
    gstNumber : Text,
    offersShipping : Bool,
    offersLocalDelivery : Bool,
    serviceableAreas : Text,
  ) : async {
    #ok : Nat;
    #err : Text;
  } {
    // No authorization check - anyone including guests can submit vendor applications
    let application : VendorApplication = {
      id = currentVendorId;
      businessName;
      businessType;
      yearsInBusiness;
      businessDescription;
      ownerName;
      email;
      phone;
      addressLine;
      city;
      state;
      country;
      pincode;
      productTypes;
      categories;
      approxProducts;
      gstNumber;
      offersShipping;
      offersLocalDelivery;
      serviceableAreas;
      status = #pending;
      submittedAt = Time.now();
    };
    vendorApplications.add(currentVendorId, application);
    currentVendorId += 1;
    #ok(application.id);
  };

  public query ({ caller }) func getAllVendorApplications() : async [VendorApplication] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all vendor applications");
    };
    vendorApplications.values().toArray();
  };

  public query ({ caller }) func getVendorApplicationCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view vendor application count");
    };
    vendorApplications.size();
  };

  public shared ({ caller }) func updateVendorApplicationStatus(id : Nat, status : VendorApplicationStatus) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update vendor application status");
    };
    switch (vendorApplications.get(id)) {
      case (null) { false };
      case (?application) {
        let updatedApplication = { application with status };
        vendorApplications.add(id, updatedApplication);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteVendorApplication(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete vendor applications");
    };
    switch (vendorApplications.get(id)) {
      case (null) { false };
      case (?_application) {
        vendorApplications.remove(id);
        true;
      };
    };
  };

  // Session management functions - all admin-only
  public shared ({ caller }) func registerAdminSession(token : Text, deviceInfo : Text, timezone : Text, ipHint : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can register admin sessions");
    };
    if (blocklist.containsKey(token)) { return false };

    let sessionInfo : SessionInfo = {
      token;
      deviceInfo;
      timezone;
      loginTime = Time.now();
      ipHint;
    };

    sessions.add(token, sessionInfo);
    true;
  };

  public query ({ caller }) func getAllAdminSessions() : async [SessionInfo] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view admin sessions");
    };
    sessions.values().toArray();
  };

  public shared ({ caller }) func removeAdminSession(token : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove admin sessions");
    };
    switch (sessions.get(token)) {
      case (null) { false };
      case (?_session) {
        sessions.remove(token);
        true;
      };
    };
  };

  public shared ({ caller }) func blockSession(token : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can block sessions");
    };
    blocklist.add(token, ());
    sessions.remove(token);
    true;
  };

  public shared ({ caller }) func unblockSession(token : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can unblock sessions");
    };
    switch (blocklist.get(token)) {
      case (null) { false };
      case (?_block) {
        blocklist.remove(token);
        true;
      };
    };
  };

  public query ({ caller }) func isSessionBlocked(token : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can check session block status");
    };
    blocklist.containsKey(token);
  };

  public query ({ caller }) func getBlockedSessions() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view blocked sessions");
    };
    blocklist.keys().toArray();
  };
};
