import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils"; // Assumes shadcn's utility for class merging
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, UserCog, Save, Loader2, Info, XCircle, CheckCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Note: This component requires 'framer-motion'.

// --- Internal Data Structures ---
export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  currentRoleIds: string[]; // IDs of roles currently assigned to this user
}

// --- 📦 API (Props) Definition ---
export interface UserPermissionsManagerProps {
  /** Array of all available roles/permissions. */
  availableRoles: Role[];
  /** Array of all users in the system. */
  allUsers: User[];
  /** Callback when user permissions are updated. */
  onUpdatePermissions: (userId: string, newRoleIds: string[]) => Promise<void>;
  /** Optional class name for the card container. */
  className?: string;
}

const UserPermissionsManager: React.FC<UserPermissionsManagerProps> = ({
  availableRoles,
  allUsers,
  onUpdatePermissions,
  className,
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [editingRoleIds, setEditingRoleIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const selectedUser = useMemo(() => 
    allUsers.find(user => user.id === selectedUserId), 
  [allUsers, selectedUserId]);

  // Initialize editingRoleIds when a user is selected
  useEffect(() => {
    if (selectedUser) {
      setEditingRoleIds(selectedUser.currentRoleIds);
      setSaveStatus('idle'); // Reset status on user change
    } else {
      setEditingRoleIds([]);
    }
  }, [selectedUser]);

  const handleRoleToggle = (roleId: string, isChecked: boolean) => {
    setEditingRoleIds(prev =>
      isChecked ? [...prev, roleId] : prev.filter(id => id !== roleId)
    );
    setSaveStatus('idle'); // Reset status if changes are made
  };

  const handleSave = async () => {
    if (!selectedUser) return;

    setIsSaving(true);
    setSaveStatus('idle'); // Clear previous status
    try {
      await onUpdatePermissions(selectedUser.id, editingRoleIds);
      setSaveStatus('success');
      // Optionally update the selectedUser's currentRoleIds in `allUsers` state here
    } catch (error) {
      console.error("Failed to update permissions:", error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  // Check if there are any pending changes
  const hasChanges = useMemo(() => {
    if (!selectedUser) return false;
    const originalRoleIds = new Set(selectedUser.currentRoleIds);
    const newRoleIds = new Set(editingRoleIds);
    
    if (originalRoleIds.size !== newRoleIds.size) return true;
    for (const roleId of newRoleIds) {
      if (!originalRoleIds.has(roleId)) return true;
    }
    return false;
  }, [selectedUser, editingRoleIds]);

  // Framer Motion variants for section entry
  const sectionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25, delay: 0.1 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <Card className={cn("w-full max-w-2xl mx-auto shadow-xl", className)}>
      <CardHeader className="p-6 border-b">
        <CardTitle className="text-2xl font-bold text-foreground flex items-center">
          <UserCog className="h-6 w-6 mr-3 text-primary" />
          User Permissions Manager
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground mt-1">
          Select a user to view and modify their assigned roles and permissions.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* User Selection */}
        <div className="space-y-2">
          <label htmlFor="user-select" className="text-sm font-medium text-foreground flex items-center">
            <Search className="h-4 w-4 mr-2 text-muted-foreground" /> Select User
          </label>
          <Select value={selectedUserId || ''} onValueChange={setSelectedUserId}>
            <SelectTrigger id="user-select" className="w-full">
              <SelectValue placeholder="Search or select a user" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
              {allUsers.length === 0 && <SelectItem value="no-users" disabled>No users found</SelectItem>}
              {allUsers.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <AnimatePresence mode="wait">
          {selectedUser ? (
            <motion.div
              key="permissions-view"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              {/* User Info Display */}
              <div className="p-4 bg-muted/30 rounded-lg border border-muted flex items-center space-x-3 text-sm">
                <Info className="h-4 w-4 text-muted-foreground shrink-0" />
                <p>
                  Editing roles for <strong className="text-primary">{selectedUser.name}</strong> ({selectedUser.email}).
                </p>
              </div>

              <Separator />

              {/* Roles List */}
              <div className="space-y-2">
                <h4 className="text-base font-semibold text-foreground">Assigned Roles</h4>
                <p className="text-sm text-muted-foreground">Check roles to assign, uncheck to remove.</p>
                <ScrollArea className="h-[250px] pr-4">
                  <div className="space-y-4 pt-2">
                    {availableRoles.length === 0 ? (
                      <p className="text-muted-foreground text-sm">No roles available to assign.</p>
                    ) : (
                      availableRoles.map(role => (
                        <motion.div
                          key={role.id}
                          layout
                          className="flex items-start space-x-3 py-1.5"
                          whileHover={{ backgroundColor: 'hsl(var(--muted))', borderRadius: '0.375rem', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}
                          transition={{ duration: 0.15 }}
                        >
                          <Checkbox
                            id={`role-${role.id}`}
                            checked={editingRoleIds.includes(role.id)}
                            onCheckedChange={(checked: boolean) => handleRoleToggle(role.id, checked)}
                            className="mt-1"
                          />
                          <label htmlFor={`role-${role.id}`} className="flex flex-col cursor-pointer">
                            <span className="text-sm font-medium leading-none text-foreground">{role.name}</span>
                            <span className="text-xs text-muted-foreground mt-0.5">{role.description}</span>
                          </label>
                        </motion.div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* Save Button & Status */}
              <div className="flex justify-between items-center pt-4 border-t mt-6">
                <div className="text-sm">
                  {saveStatus === 'success' && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-500 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1.5" /> Changes saved!
                    </motion.p>
                  )}
                  {saveStatus === 'error' && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-destructive flex items-center">
                      <XCircle className="h-4 w-4 mr-1.5" /> Save failed.
                    </motion.p>
                  )}
                  {hasChanges && saveStatus === 'idle' && (
                     <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-muted-foreground flex items-center">
                        <Info className="h-4 w-4 mr-1.5" /> Unsaved changes.
                    </motion.p>
                  )}
                </div>
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving || !hasChanges}
                    className="transition-shadow duration-150"
                  >
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className={cn("h-4 w-4 mr-2", isSaving && "hidden")} />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="no-user-selected"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-center p-8 text-muted-foreground"
            >
              <UserCog className="h-12 w-12 mx-auto mb-4" />
              <p>Please select a user from the dropdown above to manage their permissions.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};


const mockRoles: Role[] = [
  { id: 'admin', name: 'Administrator', description: 'Full access to all platform features and data.' },
  { id: 'editor', name: 'Content Editor', description: 'Can create, edit, and publish content.' },
  { id: 'viewer', name: 'Data Viewer', description: 'Read-only access to analytics and reports.' },
  { id: 'support', name: 'Support Agent', description: 'Access to user management and support tickets.' },
];

const mockUsers: User[] = [
  { id: 'u1', name: 'Alice Smith', email: 'alice@example.com', currentRoleIds: ['admin', 'viewer'] },
  { id: 'u2', name: 'Bob Johnson', email: 'bob@example.com', currentRoleIds: ['editor'] },
  { id: 'u3', name: 'Charlie Brown', email: 'charlie@example.com', currentRoleIds: ['viewer', 'support'] },
  { id: 'u4', name: 'Diana Prince', email: 'diana@example.com', currentRoleIds: [] },
];

const ExampleUsage = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);

  const handleUpdatePermissions = async (userId: string, newRoleIds: string[]) => {
    // Simulate API call
    console.log(`Simulating API call: Updating user ${userId} with roles:`, newRoleIds);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    // Update the local state to reflect the change
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, currentRoleIds: newRoleIds } : user
      )
    );
    console.log(`Permissions for ${userId} updated successfully.`);
  };

  return (
    <div className="p-8 bg-background border rounded-lg max-w-3xl mx-auto shadow-md">
      <h3 className="text-xl font-semibold text-foreground mb-6">User Role & Permissions Demo</h3>
      
      <UserPermissionsManager
        availableRoles={mockRoles}
        allUsers={users}
        onUpdatePermissions={handleUpdatePermissions}
      />
      
      <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
        <p>
          Select a user, then check/uncheck roles to see "Unsaved changes" appear.
          Click "Save Changes" to simulate an API call and update the user's roles.
        </p>
        <p className="mt-2 text-xs">
            User state is managed locally in this demo for immediate feedback.
        </p>
      </div>
    </div>
  );
};


export default ExampleUsage; 