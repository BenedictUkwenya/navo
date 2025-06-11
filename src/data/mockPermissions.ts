// src/data/mockPermissions.ts

export interface Permission {
    title: string;
    permissions: string[];
  }
  
  export const permissionGroups: Permission[] = [
    {
      title: "Shipments",
      permissions: [ "View Shipments", "Add/Remove Investments", "View Transaction History", "Update Shipment Information" ]
    },
    {
      title: "Transactions",
      permissions: [ "Deposit Funds", "Withdraw Funds", "View Transaction History", "Flag Suspicious Activity", "Generate Financial Reports" ]
    },
    {
      title: "Support and Communication",
      permissions: [ "Respond to User Queries", "Send Announcements", "Manage Support Tickets" ]
    },
    {
      title: "Educational Resources",
      permissions: [ "Publish Guides and Articles", "Witness and Workshops", "Polls" ]
    },
    {
      title: "System Administration",
      permissions: [ "Configure Web/App Settings", "Monitor System Performance", "Backup and Restore Data", "Security Management" ]
    },
    {
      title: "Content Management",
      permissions: [ "Manage Educational Resources", "Update Investment News", "Manage Alerts and Notifications" ]
    },
    {
      title: "Alerts and Notifications",
      permissions: [ "Price Alerts", "News Alerts", "Transaction Alerts" ]
    }
  ];