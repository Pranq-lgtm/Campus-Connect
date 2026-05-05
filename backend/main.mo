import Array "mo:core/Array";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type UserRole = { #student; #faculty; #staff };

  public type UserProfile = {
    name : Text;
    role : UserRole;
    department : Text;
    bio : Text;
  };

  public type Announcement = {
    id : Nat;
    title : Text;
    body : Text;
    author : Principal;
    timestamp : Int;
    category : Text;
  };

  public type AnnouncementInput = {
    title : Text;
    body : Text;
    category : Text;
  };

  public type Event = {
    id : Nat;
    title : Text;
    description : Text;
    date : Int;
    location : Text;
    organizer : Principal;
  };

  public type EventInput = {
    title : Text;
    description : Text;
    date : Int;
    location : Text;
  };

  var userProfiles = Map.empty<Principal, UserProfile>();
  var announcements = Map.empty<Nat, Announcement>();
  var events = Map.empty<Nat, Event>();
  var nextAnnouncementId : Nat = 0;
  var nextEventId : Nat = 0;

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
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

  public query func listProfiles() : async [(Principal, UserProfile)] {
    userProfiles.toArray();
  };

  public query func listAnnouncements() : async [Announcement] {
    let pairs = announcements.toArray();
    pairs.map<(Nat, Announcement), Announcement>(func((_, a)) { a });
  };

  public query func getAnnouncement(id : Nat) : async ?Announcement {
    announcements.get(id);
  };

  public shared ({ caller }) func createAnnouncement(input : AnnouncementInput) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create announcements");
    };
    let id = nextAnnouncementId;
    nextAnnouncementId += 1;
    let announcement : Announcement = {
      id = id;
      title = input.title;
      body = input.body;
      author = caller;
      timestamp = Time.now();
      category = input.category;
    };
    announcements.add(id, announcement);
    id;
  };

  public shared ({ caller }) func deleteAnnouncement(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete announcements");
    };
    switch (announcements.get(id)) {
      case null { Runtime.trap("Announcement not found") };
      case (?a) {
        if (a.author != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the author or an admin can delete this announcement");
        };
        announcements.remove(id);
      };
    };
  };

  public query func listEvents() : async [Event] {
    let pairs = events.toArray();
    pairs.map<(Nat, Event), Event>(func((_, e)) { e });
  };

  public query func getEvent(id : Nat) : async ?Event {
    events.get(id);
  };

  public shared ({ caller }) func createEvent(input : EventInput) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create events");
    };
    let id = nextEventId;
    nextEventId += 1;
    let event : Event = {
      id = id;
      title = input.title;
      description = input.description;
      date = input.date;
      location = input.location;
      organizer = caller;
    };
    events.add(id, event);
    id;
  };

  public shared ({ caller }) func deleteEvent(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete events");
    };
    switch (events.get(id)) {
      case null { Runtime.trap("Event not found") };
      case (?e) {
        if (e.organizer != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the organizer or an admin can delete this event");
        };
        events.remove(id);
      };
    };
  };

  public shared ({ caller }) func assignUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func getMyRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };
};
