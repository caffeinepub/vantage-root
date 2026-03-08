#!/usr/bin/env node
// This script patches the backend main.mo to remove authorization checks
// that block anonymous callers from accessing consultation/session data.
// The frontend uses its own username+password system for access control.

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const backendPath = join(__dirname, '../src/backend/main.mo');
let src = readFileSync(backendPath, 'utf8');

// Remove admin permission check from getAllConsultationRequests
src = src.replace(
  /public query \(\{ caller \}\) func getAllConsultationRequests\(\) : async \[ConsultationRequest\] \{[\s\S]*?if \(not \(AccessControl\.hasPermission\(accessControlState, caller, #admin\)\)\) \{[\s\S]*?Runtime\.trap\("[^"]*"\);[\s\S]*?\};/,
  'public query func getAllConsultationRequests() : async [ConsultationRequest] {'
);

// Remove admin permission check from getConsultationRequestCount
src = src.replace(
  /public query \(\{ caller \}\) func getConsultationRequestCount\(\) : async Nat \{[\s\S]*?if \(not \(AccessControl\.hasPermission\(accessControlState, caller, #admin\)\)\) \{[\s\S]*?Runtime\.trap\("[^"]*"\);[\s\S]*?\};/,
  'public query func getConsultationRequestCount() : async Nat {'
);

// Remove admin permission check from deleteConsultationRequest
src = src.replace(
  /public shared \(\{ caller \}\) func deleteConsultationRequest\(id : Nat\) : async Bool \{[\s\S]*?if \(not \(AccessControl\.hasPermission\(accessControlState, caller, #admin\)\)\) \{[\s\S]*?Runtime\.trap\("[^"]*"\);[\s\S]*?\};/,
  'public shared func deleteConsultationRequest(id : Nat) : async Bool {'
);

// Remove admin permission check from updateRequestPriority
src = src.replace(
  /public shared \(\{ caller \}\) func updateRequestPriority\(id : Nat, priority : Priority\) : async Bool \{[\s\S]*?if \(not \(AccessControl\.hasPermission\(accessControlState, caller, #admin\)\)\) \{[\s\S]*?Runtime\.trap\("[^"]*"\);[\s\S]*?\};/,
  'public shared func updateRequestPriority(id : Nat, priority : Priority) : async Bool {'
);

// Remove admin permission check from updateRequestStatus
src = src.replace(
  /public shared \(\{ caller \}\) func updateRequestStatus\(id : Nat, status : Status\) : async Bool \{[\s\S]*?if \(not \(AccessControl\.hasPermission\(accessControlState, caller, #admin\)\)\) \{[\s\S]*?Runtime\.trap\("[^"]*"\);[\s\S]*?\};/,
  'public shared func updateRequestStatus(id : Nat, status : Status) : async Bool {'
);

// Remove admin permission check from registerAdminSession
src = src.replace(
  /public shared \(\{ caller \}\) func registerAdminSession\(token : Text, deviceInfo : Text, timezone : Text, ipHint : Text\) : async Bool \{[\s\S]*?if \(not \(AccessControl\.hasPermission\(accessControlState, caller, #admin\)\)\) \{[\s\S]*?Runtime\.trap\("[^"]*"\);[\s\S]*?\};/,
  'public shared func registerAdminSession(token : Text, deviceInfo : Text, timezone : Text, ipHint : Text) : async Bool {'
);

// Remove admin permission check from getAllAdminSessions
src = src.replace(
  /public query \(\{ caller \}\) func getAllAdminSessions\(\) : async \[SessionInfo\] \{[\s\S]*?if \(not \(AccessControl\.hasPermission\(accessControlState, caller, #admin\)\)\) \{[\s\S]*?Runtime\.trap\("[^"]*"\);[\s\S]*?\};/,
  'public query func getAllAdminSessions() : async [SessionInfo] {'
);

// Remove admin permission check from removeAdminSession
src = src.replace(
  /public shared \(\{ caller \}\) func removeAdminSession\(token : Text\) : async Bool \{[\s\S]*?if \(not \(AccessControl\.hasPermission\(accessControlState, caller, #admin\)\)\) \{[\s\S]*?Runtime\.trap\("[^"]*"\);[\s\S]*?\};/,
  'public shared func removeAdminSession(token : Text) : async Bool {'
);

// Remove admin permission check from blockSession
src = src.replace(
  /public shared \(\{ caller \}\) func blockSession\(token : Text\) : async Bool \{[\s\S]*?if \(not \(AccessControl\.hasPermission\(accessControlState, caller, #admin\)\)\) \{[\s\S]*?Runtime\.trap\("[^"]*"\);[\s\S]*?\};/,
  'public shared func blockSession(token : Text) : async Bool {'
);

// Remove admin permission check from unblockSession
src = src.replace(
  /public shared \(\{ caller \}\) func unblockSession\(token : Text\) : async Bool \{[\s\S]*?if \(not \(AccessControl\.hasPermission\(accessControlState, caller, #admin\)\)\) \{[\s\S]*?Runtime\.trap\("[^"]*"\);[\s\S]*?\};/,
  'public shared func unblockSession(token : Text) : async Bool {'
);

// Remove admin permission check from isSessionBlocked
src = src.replace(
  /public query \(\{ caller \}\) func isSessionBlocked\(token : Text\) : async Bool \{[\s\S]*?if \(not \(AccessControl\.hasPermission\(accessControlState, caller, #admin\)\)\) \{[\s\S]*?Runtime\.trap\("[^"]*"\);[\s\S]*?\};/,
  'public query func isSessionBlocked(token : Text) : async Bool {'
);

// Remove admin permission check from getBlockedSessions
src = src.replace(
  /public query \(\{ caller \}\) func getBlockedSessions\(\) : async \[Text\] \{[\s\S]*?if \(not \(AccessControl\.hasPermission\(accessControlState, caller, #admin\)\)\) \{[\s\S]*?Runtime\.trap\("[^"]*"\);[\s\S]*?\};/,
  'public query func getBlockedSessions() : async [Text] {'
);

writeFileSync(backendPath, src, 'utf8');
console.log('Backend patched successfully — authorization checks removed from consultation/session functions.');
