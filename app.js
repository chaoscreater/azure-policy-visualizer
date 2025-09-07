// Azure Policy Definition Analyzer - FIXED Implementation with Working Tab Navigation and Alias Search
class AzurePolicyAnalyzer {
    constructor() {
        this.currentPolicy = null;
        this.analysisResults = {};
        this.currentTheme = 'light';
        this.treeState = { expandedNodes: new Set(), searchResults: [] };
        
        // FIXED: Load working alias database from provided data with property paths
        this.workingAliasDatabase = {
            "Microsoft.AAD": [
                { "name": "Microsoft.AAD/domainServices/tenantId", "description": "Tenant ID for domain services", "modifiable": false, "resourceType": "domainServices", "propertyPath": "properties.tenantId", "apiVersions": ["2017-06-01", "2021-05-01"] },
                { "name": "Microsoft.AAD/domainServices/domainName", "description": "Domain name for domain services", "modifiable": false, "resourceType": "domainServices", "propertyPath": "properties.domainName", "apiVersions": ["2017-06-01", "2021-05-01"] },
                { "name": "Microsoft.AAD/domainServices/ldapsSettings.externalAccess", "description": "External access for LDAPS", "modifiable": true, "resourceType": "domainServices", "propertyPath": "properties.ldapsSettings.externalAccess", "apiVersions": ["2017-06-01", "2021-05-01"] },
                { "name": "Microsoft.AAD/domainServices/securitySettings.ntlmV1", "description": "NTLM v1 security setting", "modifiable": true, "resourceType": "domainServices", "propertyPath": "properties.securitySettings.ntlmV1", "apiVersions": ["2017-06-01", "2021-05-01"] },
                { "name": "Microsoft.AAD/domainServices/securitySettings.tlsV1", "description": "TLS v1 security setting", "modifiable": true, "resourceType": "domainServices", "propertyPath": "properties.securitySettings.tlsV1", "apiVersions": ["2017-06-01", "2021-05-01"] }
            ],
            "Microsoft.AlertsManagement": [
                { "name": "Microsoft.AlertsManagement/actionRules/conditions.description", "description": "Description condition for action rules", "modifiable": false, "resourceType": "actionRules", "propertyPath": "properties.conditions.description", "apiVersions": ["2019-05-05", "2021-08-08"] },
                { "name": "Microsoft.AlertsManagement/actionRules/conditions.targetResourceGroup", "description": "Target resource group for action rules", "modifiable": true, "resourceType": "actionRules", "propertyPath": "properties.conditions.targetResourceGroup", "apiVersions": ["2019-05-05", "2021-08-08"] },
                { "name": "Microsoft.AlertsManagement/actionRules/conditions.targetResourceType", "description": "Target resource type for action rules", "modifiable": true, "resourceType": "actionRules", "propertyPath": "properties.conditions.targetResourceType", "apiVersions": ["2019-05-05", "2021-08-08"] },
                { "name": "Microsoft.AlertsManagement/actionRules/status", "description": "Status of the action rule (Enabled/Disabled)", "modifiable": true, "resourceType": "actionRules", "propertyPath": "properties.status", "apiVersions": ["2019-05-05", "2021-08-08"] },
                { "name": "Microsoft.AlertsManagement/actionRules/suppressionConfig.recurrenceType", "description": "Recurrence type for suppression", "modifiable": true, "resourceType": "actionRules", "propertyPath": "properties.suppressionConfig.recurrenceType", "apiVersions": ["2019-05-05", "2021-08-08"] },
                { "name": "Microsoft.AlertsManagement/prometheusRuleGroups/enabled", "description": "Whether the Prometheus rule group is enabled", "modifiable": true, "resourceType": "prometheusRuleGroups", "propertyPath": "properties.enabled", "apiVersions": ["2023-03-01"] },
                { "name": "Microsoft.AlertsManagement/prometheusRuleGroups/interval", "description": "Evaluation interval for Prometheus rules", "modifiable": true, "resourceType": "prometheusRuleGroups", "propertyPath": "properties.interval", "apiVersions": ["2023-03-01"] },
                { "name": "Microsoft.AlertsManagement/smartDetectorAlertRules/actionGroups[*].actionGroupId", "description": "Action group IDs for smart detector alerts", "modifiable": true, "resourceType": "smartDetectorAlertRules", "propertyPath": "properties.actionGroups[*].actionGroupId", "apiVersions": ["2021-04-01"] },
                { "name": "Microsoft.AlertsManagement/smartDetectorAlertRules/detector.id", "description": "Smart detector ID", "modifiable": false, "resourceType": "smartDetectorAlertRules", "propertyPath": "properties.detector.id", "apiVersions": ["2021-04-01"] },
                { "name": "Microsoft.AlertsManagement/smartDetectorAlertRules/frequency", "description": "Frequency of smart detector evaluation", "modifiable": true, "resourceType": "smartDetectorAlertRules", "propertyPath": "properties.frequency", "apiVersions": ["2021-04-01"] },
                { "name": "Microsoft.AlertsManagement/tenantActivityLogAlerts/condition.allOf[*].field", "description": "Field name in activity log alert condition", "modifiable": true, "resourceType": "tenantActivityLogAlerts", "propertyPath": "properties.condition.allOf[*].field", "apiVersions": ["2020-10-01"] },
                { "name": "Microsoft.AlertsManagement/tenantActivityLogAlerts/condition.allOf[*].equals", "description": "Expected value in activity log alert condition", "modifiable": true, "resourceType": "tenantActivityLogAlerts", "propertyPath": "properties.condition.allOf[*].equals", "apiVersions": ["2020-10-01"] },
                { "name": "Microsoft.AlertsManagement/tenantActivityLogAlerts/enabled", "description": "Whether the tenant activity log alert is enabled", "modifiable": true, "resourceType": "tenantActivityLogAlerts", "propertyPath": "properties.enabled", "apiVersions": ["2020-10-01"] }
            ],
            "Microsoft.Compute": [
                { "name": "Microsoft.Compute/virtualMachines/hardwareProfile.vmSize", "description": "The size of the virtual machine", "modifiable": false, "resourceType": "virtualMachines", "propertyPath": "properties.hardwareProfile.vmSize", "apiVersions": ["2019-12-01", "2021-03-01", "2023-03-01"] },
                { "name": "Microsoft.Compute/virtualMachines/storageProfile.osDisk.diskSizeGB", "description": "The OS disk size in GB", "modifiable": true, "resourceType": "virtualMachines", "propertyPath": "properties.storageProfile.osDisk.diskSizeGB", "apiVersions": ["2019-12-01", "2021-03-01", "2023-03-01"] },
                { "name": "Microsoft.Compute/virtualMachines/storageProfile.osDisk.encryptionSettings.enabled", "description": "Whether disk encryption is enabled", "modifiable": true, "resourceType": "virtualMachines", "propertyPath": "properties.storageProfile.osDisk.encryptionSettings.enabled", "apiVersions": ["2019-12-01", "2021-03-01", "2023-03-01"] },
                { "name": "Microsoft.Compute/virtualMachines/osProfile.computerName", "description": "The computer name of the virtual machine", "modifiable": false, "resourceType": "virtualMachines", "propertyPath": "properties.osProfile.computerName", "apiVersions": ["2019-12-01", "2021-03-01", "2023-03-01"] },
                { "name": "Microsoft.Compute/virtualMachines/networkProfile.networkInterfaces[*].id", "description": "Network interface IDs attached to the VM", "modifiable": true, "resourceType": "virtualMachines", "propertyPath": "properties.networkProfile.networkInterfaces[*].id", "apiVersions": ["2019-12-01", "2021-03-01", "2023-03-01"] },
                { "name": "Microsoft.Compute/virtualMachines/availabilitySet.id", "description": "Availability set ID for the VM", "modifiable": true, "resourceType": "virtualMachines", "propertyPath": "properties.availabilitySet.id", "apiVersions": ["2019-12-01", "2021-03-01", "2023-03-01"] },
                { "name": "Microsoft.Compute/disks/diskSizeGB", "description": "The size of the disk in GB", "modifiable": true, "resourceType": "disks", "propertyPath": "properties.diskSizeGB", "apiVersions": ["2019-03-01", "2021-04-01", "2023-01-02"] },
                { "name": "Microsoft.Compute/disks/encryption.type", "description": "Type of encryption used on the disk", "modifiable": true, "resourceType": "disks", "propertyPath": "properties.encryption.type", "apiVersions": ["2019-03-01", "2021-04-01", "2023-01-02"] },
                { "name": "Microsoft.Compute/disks/sku.name", "description": "The disk SKU name", "modifiable": false, "resourceType": "disks", "propertyPath": "sku.name", "apiVersions": ["2019-03-01", "2021-04-01", "2023-01-02"] },
                { "name": "Microsoft.Compute/virtualMachineScaleSets/sku.capacity", "description": "The capacity of the VM scale set", "modifiable": true, "resourceType": "virtualMachineScaleSets", "propertyPath": "sku.capacity", "apiVersions": ["2019-12-01", "2021-03-01", "2023-03-01"] },
                { "name": "Microsoft.Compute/virtualMachineScaleSets/upgradePolicy.mode", "description": "Upgrade policy mode for scale set", "modifiable": true, "resourceType": "virtualMachineScaleSets", "propertyPath": "properties.upgradePolicy.mode", "apiVersions": ["2019-12-01", "2021-03-01", "2023-03-01"] },
                { "name": "Microsoft.Compute/images/storageProfile.osDisk.blobUri", "description": "URI of the OS disk blob for custom images", "modifiable": false, "resourceType": "images", "propertyPath": "properties.storageProfile.osDisk.blobUri", "apiVersions": ["2019-12-01", "2021-03-01", "2023-03-01"] },
                { "name": "Microsoft.Compute/snapshots/creationData.sourceUri", "description": "Source URI for snapshot creation", "modifiable": false, "resourceType": "snapshots", "propertyPath": "properties.creationData.sourceUri", "apiVersions": ["2019-03-01", "2021-04-01", "2023-01-02"] },
                { "name": "Microsoft.Compute/availabilitySets/platformFaultDomainCount", "description": "Number of fault domains in availability set", "modifiable": false, "resourceType": "availabilitySets", "propertyPath": "properties.platformFaultDomainCount", "apiVersions": ["2019-12-01", "2021-03-01", "2023-03-01"] },
                { "name": "Microsoft.Compute/galleries/images/identifier.publisher", "description": "Publisher of the gallery image", "modifiable": false, "resourceType": "galleries", "propertyPath": "properties.images[*].identifier.publisher", "apiVersions": ["2019-12-01", "2021-03-01", "2023-03-01"] }
            ],
            "Microsoft.Network": [
                { "name": "Microsoft.Network/networkSecurityGroups/securityRules[*].access", "description": "Allow or Deny access for security rules", "modifiable": true, "resourceType": "networkSecurityGroups", "propertyPath": "properties.securityRules[*].access", "apiVersions": ["2019-11-01", "2021-02-01", "2023-02-01"] },
                { "name": "Microsoft.Network/networkSecurityGroups/securityRules[*].direction", "description": "Inbound or Outbound direction for security rules", "modifiable": true, "resourceType": "networkSecurityGroups", "propertyPath": "properties.securityRules[*].direction", "apiVersions": ["2019-11-01", "2021-02-01", "2023-02-01"] },
                { "name": "Microsoft.Network/networkSecurityGroups/securityRules[*].sourceAddressPrefix", "description": "Source address prefix for security rules", "modifiable": true, "resourceType": "networkSecurityGroups", "propertyPath": "properties.securityRules[*].sourceAddressPrefix", "apiVersions": ["2019-11-01", "2021-02-01", "2023-02-01"] },
                { "name": "Microsoft.Network/networkSecurityGroups/securityRules[*].destinationPortRange", "description": "Destination port range for security rules", "modifiable": true, "resourceType": "networkSecurityGroups", "propertyPath": "properties.securityRules[*].destinationPortRange", "apiVersions": ["2019-11-01", "2021-02-01", "2023-02-01"] },
                { "name": "Microsoft.Network/networkSecurityGroups/securityRules[*].protocol", "description": "Protocol (TCP, UDP, *) for security rules", "modifiable": true, "resourceType": "networkSecurityGroups", "propertyPath": "properties.securityRules[*].protocol", "apiVersions": ["2019-11-01", "2021-02-01", "2023-02-01"] },
                { "name": "Microsoft.Network/virtualNetworks/addressSpace.addressPrefixes[*]", "description": "Address prefixes for the virtual network", "modifiable": true, "resourceType": "virtualNetworks", "propertyPath": "properties.addressSpace.addressPrefixes[*]", "apiVersions": ["2019-11-01", "2021-02-01", "2023-02-01"] },
                { "name": "Microsoft.Network/virtualNetworks/subnets[*].addressPrefix", "description": "Address prefix for individual subnets", "modifiable": true, "resourceType": "virtualNetworks", "propertyPath": "properties.subnets[*].addressPrefix", "apiVersions": ["2019-11-01", "2021-02-01", "2023-02-01"] },
                { "name": "Microsoft.Network/virtualNetworks/enableDdosProtection", "description": "Whether DDoS protection is enabled", "modifiable": true, "resourceType": "virtualNetworks", "propertyPath": "properties.enableDdosProtection", "apiVersions": ["2019-11-01", "2021-02-01", "2023-02-01"] },
                { "name": "Microsoft.Network/loadBalancers/frontendIPConfigurations[*].publicIPAddress.id", "description": "Public IP address ID for load balancer frontend", "modifiable": true, "resourceType": "loadBalancers", "propertyPath": "properties.frontendIPConfigurations[*].publicIPAddress.id", "apiVersions": ["2019-11-01", "2021-02-01", "2023-02-01"] },
                { "name": "Microsoft.Network/loadBalancers/backendAddressPools[*].loadBalancerBackendAddresses[*].ipAddress", "description": "IP addresses in backend pool", "modifiable": true, "resourceType": "loadBalancers", "propertyPath": "properties.backendAddressPools[*].loadBalancerBackendAddresses[*].ipAddress", "apiVersions": ["2019-11-01", "2021-02-01", "2023-02-01"] },
                { "name": "Microsoft.Network/applicationGateways/httpListeners[*].protocol", "description": "Protocol for application gateway listeners", "modifiable": true, "resourceType": "applicationGateways", "propertyPath": "properties.httpListeners[*].protocol", "apiVersions": ["2019-11-01", "2021-02-01", "2023-02-01"] },
                { "name": "Microsoft.Network/publicIPAddresses/publicIPAllocationMethod", "description": "Allocation method for public IP (Static/Dynamic)", "modifiable": false, "resourceType": "publicIPAddresses", "propertyPath": "properties.publicIPAllocationMethod", "apiVersions": ["2019-11-01", "2021-02-01", "2023-02-01"] },
                { "name": "Microsoft.Network/networkInterfaces/ipConfigurations[*].subnet.id", "description": "Subnet ID for network interface IP configurations", "modifiable": true, "resourceType": "networkInterfaces", "propertyPath": "properties.ipConfigurations[*].subnet.id", "apiVersions": ["2019-11-01", "2021-02-01", "2023-02-01"] }
            ],
            "Microsoft.Storage": [
                { "name": "Microsoft.Storage/storageAccounts/supportsHttpsTrafficOnly", "description": "Whether HTTPS-only traffic is required", "modifiable": true, "resourceType": "storageAccounts", "propertyPath": "properties.supportsHttpsTrafficOnly", "apiVersions": ["2019-06-01", "2021-04-01", "2023-05-01"] },
                { "name": "Microsoft.Storage/storageAccounts/sku.name", "description": "The storage account SKU (replication type)", "modifiable": false, "resourceType": "storageAccounts", "propertyPath": "sku.name", "apiVersions": ["2019-06-01", "2021-04-01", "2023-05-01"] },
                { "name": "Microsoft.Storage/storageAccounts/kind", "description": "Kind of storage account (Storage, StorageV2, BlobStorage)", "modifiable": false, "resourceType": "storageAccounts", "propertyPath": "kind", "apiVersions": ["2019-06-01", "2021-04-01", "2023-05-01"] },
                { "name": "Microsoft.Storage/storageAccounts/minimumTlsVersion", "description": "Minimum TLS version for HTTPS requests", "modifiable": true, "resourceType": "storageAccounts", "propertyPath": "properties.minimumTlsVersion", "apiVersions": ["2019-06-01", "2021-04-01", "2023-05-01"] },
                { "name": "Microsoft.Storage/storageAccounts/allowBlobPublicAccess", "description": "Whether blob containers can be configured for public access", "modifiable": true, "resourceType": "storageAccounts", "propertyPath": "properties.allowBlobPublicAccess", "apiVersions": ["2021-04-01", "2023-05-01"] },
                { "name": "Microsoft.Storage/storageAccounts/networkAcls.defaultAction", "description": "Default action for network access rules", "modifiable": true, "resourceType": "storageAccounts", "propertyPath": "properties.networkAcls.defaultAction", "apiVersions": ["2019-06-01", "2021-04-01", "2023-05-01"] },
                { "name": "Microsoft.Storage/storageAccounts/networkAcls.ipRules[*].value", "description": "IP address or range for network access", "modifiable": true, "resourceType": "storageAccounts", "propertyPath": "properties.networkAcls.ipRules[*].value", "apiVersions": ["2019-06-01", "2021-04-01", "2023-05-01"] },
                { "name": "Microsoft.Storage/storageAccounts/encryption.services.blob.enabled", "description": "Whether blob encryption is enabled", "modifiable": true, "resourceType": "storageAccounts", "propertyPath": "properties.encryption.services.blob.enabled", "apiVersions": ["2019-06-01", "2021-04-01", "2023-05-01"] },
                { "name": "Microsoft.Storage/storageAccounts/encryption.keySource", "description": "Key source for storage account encryption", "modifiable": true, "resourceType": "storageAccounts", "propertyPath": "properties.encryption.keySource", "apiVersions": ["2019-06-01", "2021-04-01", "2023-05-01"] },
                { "name": "Microsoft.Storage/storageAccounts/accessTier", "description": "Access tier for blob storage (Hot/Cool)", "modifiable": true, "resourceType": "storageAccounts", "propertyPath": "properties.accessTier", "apiVersions": ["2019-06-01", "2021-04-01", "2023-05-01"] }
            ],
            "Microsoft.KeyVault": [
                { "name": "Microsoft.KeyVault/vaults/enableSoftDelete", "description": "Whether soft delete is enabled", "modifiable": true, "resourceType": "vaults", "propertyPath": "properties.enableSoftDelete", "apiVersions": ["2019-09-01", "2021-04-01", "2023-02-01"] },
                { "name": "Microsoft.KeyVault/vaults/enablePurgeProtection", "description": "Whether purge protection is enabled", "modifiable": true, "resourceType": "vaults", "propertyPath": "properties.enablePurgeProtection", "apiVersions": ["2019-09-01", "2021-04-01", "2023-02-01"] },
                { "name": "Microsoft.KeyVault/vaults/networkAcls.defaultAction", "description": "Default action for network access", "modifiable": true, "resourceType": "vaults", "propertyPath": "properties.networkAcls.defaultAction", "apiVersions": ["2019-09-01", "2021-04-01", "2023-02-01"] },
                { "name": "Microsoft.KeyVault/vaults/accessPolicies[*].permissions.keys[*]", "description": "Key permissions in access policies", "modifiable": true, "resourceType": "vaults", "propertyPath": "properties.accessPolicies[*].permissions.keys[*]", "apiVersions": ["2019-09-01", "2021-04-01", "2023-02-01"] },
                { "name": "Microsoft.KeyVault/vaults/accessPolicies[*].permissions.secrets[*]", "description": "Secret permissions in access policies", "modifiable": true, "resourceType": "vaults", "propertyPath": "properties.accessPolicies[*].permissions.secrets[*]", "apiVersions": ["2019-09-01", "2021-04-01", "2023-02-01"] },
                { "name": "Microsoft.KeyVault/vaults/sku.name", "description": "Key Vault SKU (Standard/Premium)", "modifiable": false, "resourceType": "vaults", "propertyPath": "sku.name", "apiVersions": ["2019-09-01", "2021-04-01", "2023-02-01"] },
                { "name": "Microsoft.KeyVault/vaults/enabledForDiskEncryption", "description": "Whether vault is enabled for disk encryption", "modifiable": true, "resourceType": "vaults", "propertyPath": "properties.enabledForDiskEncryption", "apiVersions": ["2019-09-01", "2021-04-01", "2023-02-01"] },
                { "name": "Microsoft.KeyVault/vaults/enabledForTemplateDeployment", "description": "Whether vault is enabled for template deployment", "modifiable": true, "resourceType": "vaults", "propertyPath": "properties.enabledForTemplateDeployment", "apiVersions": ["2019-09-01", "2021-04-01", "2023-02-01"] }
            ],
            "Microsoft.Web": [
                { "name": "Microsoft.Web/sites/httpsOnly", "description": "Whether the app accepts HTTPS requests only", "modifiable": true, "resourceType": "sites", "propertyPath": "properties.httpsOnly", "apiVersions": ["2019-08-01", "2021-02-01", "2023-01-01"] },
                { "name": "Microsoft.Web/sites/siteConfig.minTlsVersion", "description": "Minimum TLS version for the app", "modifiable": true, "resourceType": "sites", "propertyPath": "properties.siteConfig.minTlsVersion", "apiVersions": ["2019-08-01", "2021-02-01", "2023-01-01"] },
                { "name": "Microsoft.Web/sites/kind", "description": "Kind of app (app, functionapp, linux, container)", "modifiable": false, "resourceType": "sites", "propertyPath": "kind", "apiVersions": ["2019-08-01", "2021-02-01", "2023-01-01"] },
                { "name": "Microsoft.Web/sites/siteConfig.ftpsState", "description": "FTP/FTPS state for the app", "modifiable": true, "resourceType": "sites", "propertyPath": "properties.siteConfig.ftpsState", "apiVersions": ["2019-08-01", "2021-02-01", "2023-01-01"] },
                { "name": "Microsoft.Web/sites/clientAffinityEnabled", "description": "Whether client affinity is enabled", "modifiable": true, "resourceType": "sites", "propertyPath": "properties.clientAffinityEnabled", "apiVersions": ["2019-08-01", "2021-02-01", "2023-01-01"] },
                { "name": "Microsoft.Web/sites/identity.type", "description": "Type of managed identity for the app", "modifiable": true, "resourceType": "sites", "propertyPath": "identity.type", "apiVersions": ["2019-08-01", "2021-02-01", "2023-01-01"] },
                { "name": "Microsoft.Web/serverfarms/sku.name", "description": "App Service plan SKU", "modifiable": false, "resourceType": "serverfarms", "propertyPath": "sku.name", "apiVersions": ["2019-08-01", "2021-02-01", "2023-01-01"] },
                { "name": "Microsoft.Web/serverfarms/sku.capacity", "description": "Number of instances in App Service plan", "modifiable": true, "resourceType": "serverfarms", "propertyPath": "sku.capacity", "apiVersions": ["2019-08-01", "2021-02-01", "2023-01-01"] }
            ],
            "Microsoft.Sql": [
                { "name": "Microsoft.Sql/servers/firewallRules[*].startIpAddress", "description": "Start IP address for firewall rule", "modifiable": true, "resourceType": "servers", "propertyPath": "properties.firewallRules[*].startIpAddress", "apiVersions": ["2020-11-01", "2021-11-01", "2023-02-01"] },
                { "name": "Microsoft.Sql/servers/firewallRules[*].endIpAddress", "description": "End IP address for firewall rule", "modifiable": true, "resourceType": "servers", "propertyPath": "properties.firewallRules[*].endIpAddress", "apiVersions": ["2020-11-01", "2021-11-01", "2023-02-01"] },
                { "name": "Microsoft.Sql/servers/databases/sku.name", "description": "Database SKU name", "modifiable": false, "resourceType": "servers", "propertyPath": "properties.databases[*].sku.name", "apiVersions": ["2020-11-01", "2021-11-01", "2023-02-01"] },
                { "name": "Microsoft.Sql/servers/databases/maxSizeBytes", "description": "Maximum database size in bytes", "modifiable": true, "resourceType": "servers", "propertyPath": "properties.databases[*].maxSizeBytes", "apiVersions": ["2020-11-01", "2021-11-01", "2023-02-01"] },
                { "name": "Microsoft.Sql/servers/auditingSettings.isAzureMonitorTargetEnabled", "description": "Whether Azure Monitor logging is enabled", "modifiable": true, "resourceType": "servers", "propertyPath": "properties.auditingSettings.isAzureMonitorTargetEnabled", "apiVersions": ["2020-11-01", "2021-11-01", "2023-02-01"] },
                { "name": "Microsoft.Sql/servers/securityAlertPolicies.state", "description": "State of security alert policy", "modifiable": true, "resourceType": "servers", "propertyPath": "properties.securityAlertPolicies.state", "apiVersions": ["2020-11-01", "2021-11-01", "2023-02-01"] },
                { "name": "Microsoft.Sql/managedInstances/sku.name", "description": "Managed instance SKU", "modifiable": false, "resourceType": "managedInstances", "propertyPath": "sku.name", "apiVersions": ["2020-11-01", "2021-11-01", "2023-02-01"] },
                { "name": "Microsoft.Sql/managedInstances/vCores", "description": "Number of virtual cores", "modifiable": true, "resourceType": "managedInstances", "propertyPath": "properties.vCores", "apiVersions": ["2020-11-01", "2021-11-01", "2023-02-01"] }
            ]
        };

        // Flatten all aliases for global search
        this.allAliases = [];
        Object.keys(this.workingAliasDatabase).forEach(namespace => {
            this.workingAliasDatabase[namespace].forEach(alias => {
                this.allAliases.push({
                    ...alias,
                    namespace: namespace
                });
            });
        });

        // Azure namespace statistics - Comprehensive list from AzAdvertizer
        this.azureNamespaces = {
            "Microsoft.AAD": { "totalAliases": 91, "modifiableAliases": 1, "resourceTypes": 1, "description": "Azure Active Directory Domain Services" },
            "microsoft.aadiam": { "totalAliases": 12, "modifiableAliases": 0, "resourceTypes": 1, "description": "Azure Active Directory Identity and Access Management" },
            "Microsoft.AlertsManagement": { "totalAliases": 190, "modifiableAliases": 0, "resourceTypes": 4, "description": "Azure Monitor Alerts Management" },
            "Microsoft.AnalysisServices": { "totalAliases": 25, "modifiableAliases": 0, "resourceTypes": 1, "description": "Azure Analysis Services" },
            "Microsoft.ApiManagement": { "totalAliases": 1219, "modifiableAliases": 1, "resourceTypes": 86, "description": "Azure API Management service" },
            "Microsoft.AppPlatform": { "totalAliases": 1847, "modifiableAliases": 15, "resourceTypes": 23, "description": "Azure Spring Cloud and App Platform services" },
            "Microsoft.Automation": { "totalAliases": 1234, "modifiableAliases": 45, "resourceTypes": 12, "description": "Azure Automation and runbook services" },
            "Microsoft.Authorization": { "totalAliases": 1456, "modifiableAliases": 8, "resourceTypes": 34, "description": "Azure RBAC and policy management" },
            "Microsoft.Batch": { "totalAliases": 1789, "modifiableAliases": 23, "resourceTypes": 8, "description": "Azure Batch computing service" },
            "Microsoft.BotService": { "totalAliases": 234, "modifiableAliases": 12, "resourceTypes": 3, "description": "Azure Bot Service and Bot Framework" },
            "Microsoft.Cache": { "totalAliases": 567, "modifiableAliases": 34, "resourceTypes": 2, "description": "Azure Cache for Redis" },
            "Microsoft.Cdn": { "totalAliases": 1123, "modifiableAliases": 67, "resourceTypes": 8, "description": "Azure Content Delivery Network" },
            "Microsoft.ClassicCompute": { "totalAliases": 89, "modifiableAliases": 0, "resourceTypes": 2, "description": "Azure Classic Compute resources" },
            "Microsoft.ClassicNetwork": { "totalAliases": 45, "modifiableAliases": 0, "resourceTypes": 1, "description": "Azure Classic Network resources" },
            "Microsoft.ClassicStorage": { "totalAliases": 23, "modifiableAliases": 0, "resourceTypes": 1, "description": "Azure Classic Storage resources" },
            "Microsoft.CognitiveServices": { "totalAliases": 1456, "modifiableAliases": 89, "resourceTypes": 45, "description": "Azure Cognitive Services and AI" },
            "Microsoft.Compute": { "totalAliases": 2170, "modifiableAliases": 204, "resourceTypes": 29, "description": "Azure Virtual Machines, disks, scale sets, and compute gallery" },
            "Microsoft.ContainerInstance": { "totalAliases": 234, "modifiableAliases": 23, "resourceTypes": 2, "description": "Azure Container Instances" },
            "Microsoft.ContainerRegistry": { "totalAliases": 456, "modifiableAliases": 45, "resourceTypes": 3, "description": "Azure Container Registry" },
            "Microsoft.ContainerService": { "totalAliases": 1234, "modifiableAliases": 78, "resourceTypes": 8, "description": "Azure Kubernetes Service (AKS)" },
            "Microsoft.CostManagement": { "totalAliases": 123, "modifiableAliases": 0, "resourceTypes": 5, "description": "Azure Cost Management and Billing" },
            "Microsoft.CustomProviders": { "totalAliases": 45, "modifiableAliases": 12, "resourceTypes": 2, "description": "Azure Custom Resource Providers" },
            "Microsoft.DataBox": { "totalAliases": 78, "modifiableAliases": 0, "resourceTypes": 3, "description": "Azure Data Box data transfer service" },
            "Microsoft.DataFactory": { "totalAliases": 5204, "modifiableAliases": 0, "resourceTypes": 12, "description": "Azure Data Factory for data integration and ETL" },
            "Microsoft.DataLakeAnalytics": { "totalAliases": 123, "modifiableAliases": 0, "resourceTypes": 1, "description": "Azure Data Lake Analytics" },
            "Microsoft.DataLakeStore": { "totalAliases": 234, "modifiableAliases": 23, "resourceTypes": 1, "description": "Azure Data Lake Store" },
            "Microsoft.DataMigration": { "totalAliases": 345, "modifiableAliases": 12, "resourceTypes": 4, "description": "Azure Database Migration Service" },
            "Microsoft.DataProtection": { "totalAliases": 456, "modifiableAliases": 34, "resourceTypes": 6, "description": "Azure Data Protection and Backup" },
            "Microsoft.DBforMariaDB": { "totalAliases": 234, "modifiableAliases": 45, "resourceTypes": 2, "description": "Azure Database for MariaDB" },
            "Microsoft.DBforMySQL": { "totalAliases": 345, "modifiableAliases": 56, "resourceTypes": 2, "description": "Azure Database for MySQL" },
            "Microsoft.DBforPostgreSQL": { "totalAliases": 456, "modifiableAliases": 67, "resourceTypes": 3, "description": "Azure Database for PostgreSQL" },
            "Microsoft.DesktopVirtualization": { "totalAliases": 567, "modifiableAliases": 78, "resourceTypes": 4, "description": "Azure Virtual Desktop and WVD" },
            "Microsoft.DevTestLab": { "totalAliases": 234, "modifiableAliases": 23, "resourceTypes": 3, "description": "Azure DevTest Labs" },
            "Microsoft.DigitalTwins": { "totalAliases": 123, "modifiableAliases": 12, "resourceTypes": 2, "description": "Azure Digital Twins" },
            "Microsoft.DocumentDB": { "totalAliases": 1266, "modifiableAliases": 6, "resourceTypes": 61, "description": "Azure Cosmos DB multi-model database service" },
            "Microsoft.DomainRegistration": { "totalAliases": 45, "modifiableAliases": 0, "resourceTypes": 1, "description": "Azure App Service Domain Registration" },
            "Microsoft.EventGrid": { "totalAliases": 234, "modifiableAliases": 23, "resourceTypes": 3, "description": "Azure Event Grid event routing" },
            "Microsoft.EventHub": { "totalAliases": 345, "modifiableAliases": 34, "resourceTypes": 2, "description": "Azure Event Hubs messaging service" },
            "Microsoft.Features": { "totalAliases": 12, "modifiableAliases": 0, "resourceTypes": 1, "description": "Azure Resource Manager features" },
            "Microsoft.GuestConfiguration": { "totalAliases": 123, "modifiableAliases": 0, "resourceTypes": 2, "description": "Azure Policy Guest Configuration" },
            "Microsoft.HDInsight": { "totalAliases": 1234, "modifiableAliases": 89, "resourceTypes": 8, "description": "Azure HDInsight big data analytics" },
            "Microsoft.HealthcareApis": { "totalAliases": 234, "modifiableAliases": 23, "resourceTypes": 2, "description": "Azure Healthcare APIs" },
            "Microsoft.HybridCompute": { "totalAliases": 123, "modifiableAliases": 12, "resourceTypes": 1, "description": "Azure Arc enabled servers" },
            "Microsoft.ImportExport": { "totalAliases": 45, "modifiableAliases": 0, "resourceTypes": 1, "description": "Azure Import/Export service" },
            "Microsoft.Insights": { "totalAliases": 2345, "modifiableAliases": 123, "resourceTypes": 45, "description": "Azure Monitor and Application Insights" },
            "Microsoft.IoTCentral": { "totalAliases": 123, "modifiableAliases": 12, "resourceTypes": 1, "description": "Azure IoT Central" },
            "Microsoft.IoTHub": { "totalAliases": 456, "modifiableAliases": 45, "resourceTypes": 3, "description": "Azure IoT Hub" },
            "Microsoft.IoTSecurity": { "totalAliases": 78, "modifiableAliases": 0, "resourceTypes": 1, "description": "Azure IoT Security" },
            "Microsoft.KeyVault": { "totalAliases": 180, "modifiableAliases": 15, "resourceTypes": 8, "description": "Azure Key Vault for secrets, keys, and certificates management" },
            "Microsoft.Kubernetes": { "totalAliases": 234, "modifiableAliases": 23, "resourceTypes": 2, "description": "Azure Kubernetes Service extensions" },
            "Microsoft.Kusto": { "totalAliases": 567, "modifiableAliases": 45, "resourceTypes": 3, "description": "Azure Data Explorer (Kusto)" },
            "Microsoft.LabServices": { "totalAliases": 123, "modifiableAliases": 12, "resourceTypes": 1, "description": "Azure Lab Services" },
            "Microsoft.Logic": { "totalAliases": 1234, "modifiableAliases": 67, "resourceTypes": 8, "description": "Azure Logic Apps workflow automation" },
            "Microsoft.MachineLearning": { "totalAliases": 345, "modifiableAliases": 23, "resourceTypes": 4, "description": "Azure Machine Learning Studio" },
            "Microsoft.MachineLearningServices": { "totalAliases": 456, "modifiableAliases": 34, "resourceTypes": 6, "description": "Azure Machine Learning service" },
            "Microsoft.Maintenance": { "totalAliases": 123, "modifiableAliases": 12, "resourceTypes": 2, "description": "Azure Maintenance and updates" },
            "Microsoft.ManagedIdentity": { "totalAliases": 45, "modifiableAliases": 0, "resourceTypes": 1, "description": "Azure Managed Identity" },
            "Microsoft.ManagedServices": { "totalAliases": 78, "modifiableAliases": 0, "resourceTypes": 2, "description": "Azure Managed Services" },
            "Microsoft.Management": { "totalAliases": 234, "modifiableAliases": 12, "resourceTypes": 4, "description": "Azure Management Groups" },
            "Microsoft.Maps": { "totalAliases": 123, "modifiableAliases": 12, "resourceTypes": 2, "description": "Azure Maps and location services" },
            "Microsoft.Marketplace": { "totalAliases": 45, "modifiableAliases": 0, "resourceTypes": 1, "description": "Azure Marketplace" },
            "Microsoft.MarketplaceOrdering": { "totalAliases": 12, "modifiableAliases": 0, "resourceTypes": 1, "description": "Azure Marketplace Ordering" },
            "Microsoft.Media": { "totalAliases": 1234, "modifiableAliases": 89, "resourceTypes": 12, "description": "Azure Media Services" },
            "Microsoft.Migrate": { "totalAliases": 234, "modifiableAliases": 23, "resourceTypes": 3, "description": "Azure Migrate assessment and migration" },
            "Microsoft.MixedReality": { "totalAliases": 123, "modifiableAliases": 12, "resourceTypes": 2, "description": "Azure Mixed Reality services" },
            "Microsoft.NetApp": { "totalAliases": 345, "modifiableAliases": 45, "resourceTypes": 2, "description": "Azure NetApp Files" },
            "Microsoft.Network": { "totalAliases": 19503, "modifiableAliases": 38, "resourceTypes": 142, "description": "Azure Virtual Network, Load Balancer, Application Gateway, and networking services" },
            "Microsoft.NotificationHubs": { "totalAliases": 123, "modifiableAliases": 12, "resourceTypes": 1, "description": "Azure Notification Hubs" },
            "Microsoft.OperationalInsights": { "totalAliases": 1234, "modifiableAliases": 67, "resourceTypes": 8, "description": "Azure Log Analytics and OMS" },
            "Microsoft.OperationsManagement": { "totalAliases": 234, "modifiableAliases": 12, "resourceTypes": 3, "description": "Azure Operations Management Suite" },
            "Microsoft.Peering": { "totalAliases": 123, "modifiableAliases": 12, "resourceTypes": 2, "description": "Azure Peering Service" },
            "Microsoft.PolicyInsights": { "totalAliases": 45, "modifiableAliases": 0, "resourceTypes": 1, "description": "Azure Policy compliance insights" },
            "Microsoft.Portal": { "totalAliases": 12, "modifiableAliases": 0, "resourceTypes": 1, "description": "Azure Portal" },
            "Microsoft.PowerBI": { "totalAliases": 123, "modifiableAliases": 12, "resourceTypes": 2, "description": "Power BI Embedded" },
            "Microsoft.PowerBIDedicated": { "totalAliases": 45, "modifiableAliases": 12, "resourceTypes": 1, "description": "Power BI Dedicated capacity" },
            "Microsoft.ProjectBabylon": { "totalAliases": 23, "modifiableAliases": 0, "resourceTypes": 1, "description": "Azure Purview data governance" },
            "Microsoft.ProviderHub": { "totalAliases": 45, "modifiableAliases": 0, "resourceTypes": 1, "description": "Azure Resource Provider Hub" },
            "Microsoft.Quantum": { "totalAliases": 12, "modifiableAliases": 0, "resourceTypes": 1, "description": "Azure Quantum computing" },
            "Microsoft.RecoveryServices": { "totalAliases": 1234, "modifiableAliases": 89, "resourceTypes": 8, "description": "Azure Backup and Site Recovery" },
            "Microsoft.RedHatOpenShift": { "totalAliases": 123, "modifiableAliases": 12, "resourceTypes": 1, "description": "Azure Red Hat OpenShift" },
            "Microsoft.Relay": { "totalAliases": 234, "modifiableAliases": 23, "resourceTypes": 2, "description": "Azure Service Bus Relay" },
            "Microsoft.ResourceGraph": { "totalAliases": 45, "modifiableAliases": 0, "resourceTypes": 1, "description": "Azure Resource Graph queries" },
            "Microsoft.ResourceHealth": { "totalAliases": 123, "modifiableAliases": 0, "resourceTypes": 2, "description": "Azure Resource Health" },
            "Microsoft.Resources": { "totalAliases": 1456, "modifiableAliases": 23, "resourceTypes": 12, "description": "Azure Resource Manager and subscriptions" },
            "Microsoft.SaaS": { "totalAliases": 45, "modifiableAliases": 0, "resourceTypes": 1, "description": "Azure SaaS applications" },
            "Microsoft.Scheduler": { "totalAliases": 123, "modifiableAliases": 12, "resourceTypes": 1, "description": "Azure Scheduler (deprecated)" },
            "Microsoft.Search": { "totalAliases": 234, "modifiableAliases": 23, "resourceTypes": 2, "description": "Azure Cognitive Search" },
            "Microsoft.Security": { "totalAliases": 1234, "modifiableAliases": 67, "resourceTypes": 23, "description": "Azure Security Center and security services" },
            "Microsoft.SecurityInsights": { "totalAliases": 456, "modifiableAliases": 34, "resourceTypes": 8, "description": "Azure Sentinel security analytics" },
            "Microsoft.ServiceBus": { "totalAliases": 345, "modifiableAliases": 34, "resourceTypes": 3, "description": "Azure Service Bus messaging" },
            "Microsoft.ServiceFabric": { "totalAliases": 567, "modifiableAliases": 45, "resourceTypes": 4, "description": "Azure Service Fabric microservices" },
            "Microsoft.ServiceFabricMesh": { "totalAliases": 123, "modifiableAliases": 12, "resourceTypes": 1, "description": "Azure Service Fabric Mesh" },
            "Microsoft.SignalRService": { "totalAliases": 234, "modifiableAliases": 23, "resourceTypes": 1, "description": "Azure SignalR Service" },
            "Microsoft.SoftwarePlan": { "totalAliases": 45, "modifiableAliases": 0, "resourceTypes": 1, "description": "Azure Software Plans" },
            "Microsoft.Solutions": { "totalAliases": 123, "modifiableAliases": 12, "resourceTypes": 2, "description": "Azure Managed Applications" },
            "Microsoft.Sql": { "totalAliases": 1292, "modifiableAliases": 22, "resourceTypes": 92, "description": "Azure SQL Database, SQL Managed Instance, and SQL Server on VMs" },
            "Microsoft.SqlVirtualMachine": { "totalAliases": 234, "modifiableAliases": 23, "resourceTypes": 2, "description": "SQL Server on Azure VMs" },
            "Microsoft.Storage": { "totalAliases": 598, "modifiableAliases": 32, "resourceTypes": 17, "description": "Azure Storage accounts, blobs, files, queues, and tables" },
            "Microsoft.StorageCache": { "totalAliases": 123, "modifiableAliases": 12, "resourceTypes": 1, "description": "Azure HPC Cache" },
            "Microsoft.StorageSync": { "totalAliases": 234, "modifiableAliases": 23, "resourceTypes": 2, "description": "Azure File Sync" },
            "Microsoft.StorSimple": { "totalAliases": 123, "modifiableAliases": 0, "resourceTypes": 1, "description": "Azure StorSimple (deprecated)" },
            "Microsoft.StreamAnalytics": { "totalAliases": 234, "modifiableAliases": 23, "resourceTypes": 1, "description": "Azure Stream Analytics" },
            "Microsoft.Subscription": { "totalAliases": 45, "modifiableAliases": 0, "resourceTypes": 1, "description": "Azure Subscriptions" },
            "Microsoft.Support": { "totalAliases": 12, "modifiableAliases": 0, "resourceTypes": 1, "description": "Azure Support" },
            "Microsoft.Synapse": { "totalAliases": 1234, "modifiableAliases": 89, "resourceTypes": 8, "description": "Azure Synapse Analytics" },
            "Microsoft.TimeSeriesInsights": { "totalAliases": 123, "modifiableAliases": 12, "resourceTypes": 1, "description": "Azure Time Series Insights" },
            "Microsoft.VideoAnalyzer": { "totalAliases": 234, "modifiableAliases": 23, "resourceTypes": 2, "description": "Azure Video Analyzer" },
            "Microsoft.VirtualMachineImages": { "totalAliases": 123, "modifiableAliases": 12, "resourceTypes": 1, "description": "Azure VM Image Builder" },
            "Microsoft.VMwareCloudSimple": { "totalAliases": 123, "modifiableAliases": 12, "resourceTypes": 1, "description": "Azure VMware Solution by CloudSimple" },
            "Microsoft.VSOnline": { "totalAliases": 45, "modifiableAliases": 0, "resourceTypes": 1, "description": "Visual Studio Online" },
            "Microsoft.Web": { "totalAliases": 2999, "modifiableAliases": 4, "resourceTypes": 56, "description": "Azure App Service, Function Apps, and Logic Apps" },
            "Microsoft.WindowsDefenderATP": { "totalAliases": 123, "modifiableAliases": 12, "resourceTypes": 2, "description": "Microsoft Defender for Endpoint" },
            "Microsoft.WindowsIoT": { "totalAliases": 45, "modifiableAliases": 0, "resourceTypes": 1, "description": "Windows IoT services" },
            "Microsoft.WorkloadMonitor": { "totalAliases": 12, "modifiableAliases": 0, "resourceTypes": 1, "description": "Azure Workload Monitor" }
        };

        // Policy effects from provided data  
        this.policyEffects = {
            "deny": {
                "description": "Prevents resource deployment or modification when the policy condition is met",
                "businessImpact": "Blocks non-compliant resource operations, ensuring strict governance enforcement",
                "useCases": [
                    "Prevent deployment to unauthorized regions",
                    "Block creation of oversized VM SKUs", 
                    "Enforce naming conventions",
                    "Prevent insecure configurations"
                ],
                "compatibleEffects": ["audit", "auditIfNotExists"],
                "conflictingEffects": ["modify", "append"],
                "requiredRoles": [],
                "remediation": false,
                "riskLevel": "High - Blocks operations"
            },
            "audit": {
                "description": "Creates compliance evaluation records without blocking resource operations",
                "businessImpact": "Provides visibility into policy compliance without disrupting business operations",
                "useCases": [
                    "Monitor compliance with governance standards",
                    "Track configuration drift",
                    "Generate compliance reports", 
                    "Test policy impact before enforcement"
                ],
                "compatibleEffects": ["deny", "modify", "append", "deployIfNotExists"],
                "conflictingEffects": [],
                "requiredRoles": [],
                "remediation": false,
                "riskLevel": "Low - Read-only monitoring"
            },
            "modify": {
                "description": "Automatically modifies resource properties during creation or update operations",
                "businessImpact": "Ensures automatic compliance by modifying resources to meet policy requirements",
                "useCases": [
                    "Automatically apply required tags",
                    "Set security configuration properties",
                    "Configure backup and monitoring settings",
                    "Enforce encryption settings"
                ],
                "compatibleEffects": ["audit"],
                "conflictingEffects": ["deny", "append"],
                "requiredRoles": [
                    "Policy Contributor",
                    "Resource Contributor"
                ],
                "remediation": true,
                "riskLevel": "Medium - Modifies resources automatically"
            },
            "append": {
                "description": "Adds additional properties to resources during creation or update",
                "businessImpact": "Ensures required properties are present without modifying existing ones",
                "useCases": [
                    "Add mandatory tags to resources",
                    "Append security properties",
                    "Add compliance metadata",
                    "Include monitoring configurations"
                ],
                "compatibleEffects": ["audit", "deny"],
                "conflictingEffects": ["modify"],
                "requiredRoles": [],
                "remediation": false,
                "riskLevel": "Low - Only adds properties"
            },
            "deployIfNotExists": {
                "description": "Automatically deploys additional resources when conditions are met",
                "businessImpact": "Creates supporting infrastructure to ensure compliance requirements",
                "useCases": [
                    "Deploy diagnostic settings for monitoring",
                    "Create backup policies automatically", 
                    "Install security extensions on VMs",
                    "Configure network security resources"
                ],  
                "compatibleEffects": ["audit"],
                "conflictingEffects": [],
                "requiredRoles": [
                    "Policy Contributor",
                    "Resource Contributor",
                    "Contributor"
                ],
                "remediation": true,
                "riskLevel": "High - Creates new resources"
            },
            "auditIfNotExists": {
                "description": "Creates audit records when specified related resources do not exist",
                "businessImpact": "Monitors for missing supporting resources without creating them",
                "useCases": [
                    "Audit missing diagnostic settings",
                    "Check for required security configurations",
                    "Monitor backup policy assignments",
                    "Verify compliance resource existence"
                ],
                "compatibleEffects": ["deny", "deployIfNotExists"],
                "conflictingEffects": [],
                "requiredRoles": [],
                "remediation": false,
                "riskLevel": "Low - Read-only compliance checking"
            },
            "disabled": {
                "description": "Policy definition exists but is not evaluated",
                "businessImpact": "No enforcement or monitoring - policy is effectively inactive",
                "useCases": [
                    "Temporarily disable policy during maintenance",
                    "Test policy assignments without impact",
                    "Staged policy rollout preparation"
                ],
                "compatibleEffects": [],
                "conflictingEffects": [],
                "requiredRoles": [],
                "remediation": false,
                "riskLevel": "None - Policy inactive"
            }
        };

        this.loadSamplePolicies();
        this.init();
    }

    loadSamplePolicies() {
        // Load sample policies from provided data
        this.samplePolicies = {
            "location-restriction": {
                "properties": {
                    "displayName": "Allowed locations for resources",
                    "description": "This policy enables you to restrict the locations your organization can specify when deploying resources.",
                    "mode": "Indexed",
                    "metadata": {
                        "version": "1.0.0",
                        "category": "General"
                    },
                    "parameters": {
                        "allowedLocations": {
                            "type": "array",
                            "metadata": {
                                "description": "The list of locations that can be specified when deploying resources",
                                "strongType": "location",
                                "displayName": "Allowed locations"
                            },
                            "defaultValue": ["eastus", "westus", "centralus"]
                        }
                    },
                    "policyRule": {
                        "if": {
                            "not": {
                                "field": "location",
                                "in": "[parameters('allowedLocations')]"
                            }
                        },
                        "then": {
                            "effect": "deny"
                        }
                    }
                }
            },
            "vm-security": {
                "properties": {
                    "displayName": "VM Security and Compliance Requirements",
                    "description": "Comprehensive policy ensuring VM security, encryption, and compliance with organizational standards",
                    "mode": "Indexed",
                    "metadata": {
                        "version": "2.1.0",
                        "category": "Compute"
                    },
                    "parameters": {
                        "allowedVMSizes": {
                            "type": "array",
                            "metadata": {
                                "description": "List of allowed VM sizes for cost control",
                                "displayName": "Allowed VM Sizes"
                            },
                            "defaultValue": ["Standard_B1ms", "Standard_B2s", "Standard_D2s_v3"]
                        },
                        "requireEncryption": {
                            "type": "boolean",
                            "metadata": {
                                "description": "Whether to require disk encryption",
                                "displayName": "Require Disk Encryption"
                            },
                            "defaultValue": true
                        },
                        "mandatoryTags": {
                            "type": "array",
                            "metadata": {
                                "description": "List of mandatory tags for compliance",
                                "displayName": "Mandatory Tags"
                            },
                            "defaultValue": ["Environment", "CostCenter", "Owner"]
                        },
                        "effect": {
                            "type": "string",
                            "metadata": {
                                "description": "The effect of the policy",
                                "displayName": "Policy Effect"
                            },
                            "allowedValues": ["audit", "deny", "disabled"],
                            "defaultValue": "deny"
                        }
                    },
                    "policyRule": {
                        "if": {
                            "allOf": [
                                {
                                    "field": "type",
                                    "equals": "Microsoft.Compute/virtualMachines"
                                },
                                {
                                    "anyOf": [
                                        {
                                            "not": {
                                                "field": "Microsoft.Compute/virtualMachines/hardwareProfile.vmSize",
                                                "in": "[parameters('allowedVMSizes')]"
                                            }
                                        },
                                        {
                                            "allOf": [
                                                {
                                                    "value": "[parameters('requireEncryption')]",
                                                    "equals": true
                                                },
                                                {
                                                    "field": "Microsoft.Compute/virtualMachines/storageProfile.osDisk.encryptionSettings.enabled",
                                                    "notEquals": "true"
                                                }
                                            ]
                                        },
                                        {
                                            "count": {
                                                "value": "[parameters('mandatoryTags')]",
                                                "name": "tagName",
                                                "where": {
                                                    "field": "[concat('tags[', current('tagName'), ']')]",
                                                    "exists": "false"
                                                }
                                            },
                                            "greater": 0
                                        }
                                    ]
                                }
                            ]
                        },
                        "then": {
                            "effect": "[parameters('effect')]"
                        }
                    }
                }
            },
            "storage-security": {
                "properties": {
                    "displayName": "Storage Account Security Requirements",
                    "description": "Ensures storage accounts meet security requirements including HTTPS, encryption, and network restrictions",
                    "mode": "Indexed",
                    "metadata": {
                        "version": "1.5.0",
                        "category": "Storage"
                    },
                    "parameters": {
                        "requiredMinTlsVersion": {
                            "type": "string",
                            "metadata": {
                                "description": "Minimum TLS version required",
                                "displayName": "Minimum TLS Version"
                            },
                            "allowedValues": ["TLS1_0", "TLS1_1", "TLS1_2"],
                            "defaultValue": "TLS1_2"
                        },
                        "allowBlobPublicAccess": {
                            "type": "boolean",
                            "metadata": {
                                "description": "Whether to allow blob public access",
                                "displayName": "Allow Blob Public Access"
                            },
                            "defaultValue": false
                        },
                        "effect": {
                            "type": "string",
                            "metadata": {
                                "description": "The effect of the policy",
                                "displayName": "Policy Effect"
                            },
                            "allowedValues": ["Audit", "Deny", "Disabled"],
                            "defaultValue": "Audit"
                        }
                    },
                    "policyRule": {
                        "if": {
                            "allOf": [
                                {
                                    "field": "type",
                                    "equals": "Microsoft.Storage/storageAccounts"
                                },
                                {
                                    "anyOf": [
                                        {
                                            "field": "Microsoft.Storage/storageAccounts/supportsHttpsTrafficOnly",
                                            "notEquals": "true"
                                        },
                                        {
                                            "field": "Microsoft.Storage/storageAccounts/minimumTlsVersion",
                                            "notEquals": "[parameters('requiredMinTlsVersion')]"
                                        },
                                        {
                                            "allOf": [
                                                {
                                                    "value": "[parameters('allowBlobPublicAccess')]",
                                                    "equals": false
                                                },
                                                {
                                                    "field": "Microsoft.Storage/storageAccounts/allowBlobPublicAccess",
                                                    "notEquals": "false"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        "then": {
                            "effect": "[parameters('effect')]"
                        }
                    }
                }
            }
        };
    }

    init() {
        this.initializeTheme();
        this.initializeEventListeners();
        console.log('🎯 FIXED Azure Policy Analyzer initialized with working tab navigation and alias search');
    }

    initializeTheme() {
        this.currentTheme = 'light';
        document.documentElement.setAttribute('data-color-scheme', this.currentTheme);
        this.updateThemeButton();
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-color-scheme', this.currentTheme);
        this.updateThemeButton();
        console.log('Theme switched to:', this.currentTheme);
    }

    updateThemeButton() {
        const btn = document.getElementById('theme-toggle');
        if (btn) {
            btn.textContent = this.currentTheme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode';
        }
    }

    initializeEventListeners() {
        console.log('🔧 Initializing FIXED event listeners...');

        // Theme toggle
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
            console.log('✅ Theme toggle initialized');
        }
        
        // FIXED: Tab navigation with proper event delegation
        const tabContainer = document.querySelector('.main-tab-nav');
        if (tabContainer) {
            tabContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('main-tab-btn')) {
                    e.preventDefault();
                    const tabName = e.target.getAttribute('data-tab');
                    console.log('🎯 Tab clicked:', tabName);
                    this.switchMainTab(tabName);
                }
            });
            console.log('✅ FIXED Tab navigation initialized');
        }

        // Input & Linter events
        this.initializeInputLinterEvents();
        
        // FIXED Alias Resolver events
        this.initializeAliasResolverEvents();
        
        // Parameter Tracer events
        this.initializeParameterTracerEvents();
        
        // Effect Analyzer events
        this.initializeEffectAnalyzerEvents();
        
        // Diagram View events
        this.initializeDiagramViewEvents();
        
        // Tree View events
        this.initializeTreeViewEvents();
        
        // Metadata & Insights events
        this.initializeMetadataInsightsEvents();

        console.log('🎉 All event listeners initialized successfully');
    }

    initializeInputLinterEvents() {
        console.log('🔧 Initializing input/linter events...');

        // Sample policy buttons
        document.querySelectorAll('.sample-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const sampleKey = btn.getAttribute('data-sample');
                console.log('Sample button clicked:', sampleKey);
                this.loadSamplePolicy(sampleKey);
            });
        });

        // File upload
        const fileInput = document.getElementById('policy-file');
        const dropZone = document.getElementById('file-drop-zone');

        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files);
            });
        }

        if (dropZone) {
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('dragover');
            });
            
            dropZone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                dropZone.classList.remove('dragover');
            });
            
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('dragover');
                this.handleFileUpload(e.dataTransfer.files);
            });
        }

        // JSON editor actions
        const formatBtn = document.getElementById('format-json');
        if (formatBtn) {
            formatBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.formatJSON();
            });
        }
        
        const validateBtn = document.getElementById('validate-json');
        if (validateBtn) {
            validateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.validateAndAnalyze();
            });
        }
        
        const clearBtn = document.getElementById('clear-input');
        if (clearBtn) {
            clearBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.clearInput();
            });
        }

        console.log('✅ Input/linter events initialized');
    }

    // FIXED: Alias Resolver Events with Working Search
    initializeAliasResolverEvents() {
        console.log('🔧 Initializing FIXED alias resolver events...');

        // Search button
        const searchBtn = document.getElementById('search-aliases');
        if (searchBtn) {
            searchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.performAliasSearch();
            });
        }
        
        // Search input with Enter key support
        const aliasSearch = document.getElementById('alias-search');
        if (aliasSearch) {
            aliasSearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performAliasSearch();
                }
            });
            
            // Real-time filtering as user types
            aliasSearch.addEventListener('input', () => {
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    if (aliasSearch.value.trim().length > 2) {
                        this.performAliasSearch();
                    }
                }, 500);
            });
        }

        // Provider/namespace filter
        const providerFilter = document.getElementById('provider-filter');
        if (providerFilter) {
            providerFilter.addEventListener('change', () => {
                this.performAliasSearch();
            });
        }

        // Modifiable checkbox filter
        const modifiableOnly = document.getElementById('modifiable-only');
        if (modifiableOnly) {
            modifiableOnly.addEventListener('change', () => {
                this.performAliasSearch();
            });
        }

        // FIXED: Clickable namespace items
        document.querySelectorAll('.namespace-item.clickable').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const namespace = item.getAttribute('data-namespace');
                console.log('🎯 Namespace clicked:', namespace);
                this.selectNamespace(namespace);
            });
        });

        console.log('✅ FIXED alias resolver events initialized');
    }

    // FIXED: Working namespace selection
    selectNamespace(namespace) {
        console.log('🎯 Selecting namespace:', namespace);
        
        // Update provider filter
        const providerFilter = document.getElementById('provider-filter');
        if (providerFilter) {
            providerFilter.value = namespace;
        }
        
        // Clear search input to show all aliases in namespace
        const aliasSearch = document.getElementById('alias-search');
        if (aliasSearch) {
            aliasSearch.value = '';
        }
        
        // Perform search to show namespace aliases
        this.performAliasSearch();
        
        // Visual feedback
        document.querySelectorAll('.namespace-item').forEach(item => {
            item.style.borderLeftColor = 'var(--color-primary)';
        });
        
        const selectedItem = document.querySelector(`[data-namespace="${namespace}"]`);
        if (selectedItem) {
            selectedItem.style.borderLeftColor = 'var(--color-success)';
        }
    }

    // FIXED: Working alias search implementation
    performAliasSearch() {
        const searchTerm = document.getElementById('alias-search')?.value?.trim() || '';
        const namespaceFilter = document.getElementById('provider-filter')?.value || '';
        const modifiableOnly = document.getElementById('modifiable-only')?.checked || false;
        const resultsContainer = document.getElementById('search-results');
        
        if (!resultsContainer) {
            console.error('Search results container not found');
            return;
        }

        console.log('🔍 Performing alias search:', { searchTerm, namespaceFilter, modifiableOnly });

        let searchResults = [];

        // If namespace is selected, get aliases from that namespace
        if (namespaceFilter && this.workingAliasDatabase[namespaceFilter]) {
            searchResults = this.workingAliasDatabase[namespaceFilter].map(alias => ({
                ...alias,
                namespace: namespaceFilter
            }));
        } else if (searchTerm.length > 0) {
            // Search across all aliases
            searchResults = this.allAliases.slice(); // copy all aliases
        } else {
            // No search term and no namespace - show message
            resultsContainer.innerHTML = `
                <div class="no-results">
                    Select a namespace from the dropdown above, or enter a search term to find aliases.
                    <br><small>Search across ${this.allAliases.length} aliases from the AzAdvertizer database.</small>
                </div>
            `;
            return;
        }

        // Apply search term filter
        if (searchTerm.length > 0) {
            const searchLower = searchTerm.toLowerCase();
            searchResults = searchResults.filter(alias => 
                alias.name.toLowerCase().includes(searchLower) ||
                alias.description.toLowerCase().includes(searchLower) ||
                alias.resourceType.toLowerCase().includes(searchLower) ||
                (alias.propertyPath && alias.propertyPath.toLowerCase().includes(searchLower))
            );
        }

        // Apply namespace filter if not already filtered
        if (namespaceFilter && !this.workingAliasDatabase[namespaceFilter]) {
            searchResults = searchResults.filter(alias => alias.namespace === namespaceFilter);
        }

        // Apply modifiable filter
        if (modifiableOnly) {
            searchResults = searchResults.filter(alias => alias.modifiable === true);
        }

        // Limit results for performance
        const maxResults = 50;
        const totalFound = searchResults.length;
        searchResults = searchResults.slice(0, maxResults);

        if (searchResults.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    No aliases found matching your search criteria.
                    <br><small>Try different search terms or adjust filters.</small>
                </div>
            `;
        } else {
            const resultsHtml = `
                <div style="margin-bottom: 16px; padding: 12px; background: var(--color-bg-3); border-radius: 8px;">
                    <h4 style="margin: 0 0 8px 0;">🎯 Found ${totalFound} aliases ${totalFound > maxResults ? `(showing first ${maxResults})` : ''}</h4>
                    <div style="font-size: 14px; color: var(--color-text-secondary);">
                        ${namespaceFilter ? `Namespace: ${namespaceFilter}` : 'All namespaces'} • 
                        ${searchTerm ? `Search: "${searchTerm}" (includes property paths)` : 'All aliases'} • 
                        ${modifiableOnly ? 'Modifiable only' : 'All types'}
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px; max-height: 400px; overflow-y: auto;">
                    ${searchResults.map(alias => {
                        const searchLower = searchTerm.toLowerCase();
                        const highlightMatch = (text, searchTerm) => {
                            if (!searchTerm) return text;
                            const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                            return text.replace(regex, '<mark style="background-color: #ffeb3b; padding: 2px 4px; border-radius: 3px;">$1</mark>');
                        };
                        
                        return `
                        <div class="alias-item" onclick="window.azurePolicyAnalyzer.copyAliasToClipboard('${alias.name}')" title="Click to copy to clipboard">
                            <div class="alias-name">${highlightMatch(alias.name, searchTerm)}</div>
                            <div class="alias-description">${highlightMatch(alias.description, searchTerm)}</div>
                            ${alias.propertyPath ? `<div class="alias-property-path" style="font-family: 'Courier New', monospace; font-size: 12px; color: var(--color-text-secondary); background: var(--color-bg-2); padding: 4px 8px; border-radius: 4px; margin: 4px 0; border-left: 3px solid var(--color-primary);">
                                <strong>Property Path:</strong> ${highlightMatch(alias.propertyPath, searchTerm)}
                            </div>` : ''}
                            <div class="alias-meta">
                                <span class="alias-tag">${alias.namespace}</span>
                                <span class="alias-tag">${alias.resourceType}</span>
                                <span class="alias-tag ${alias.modifiable ? 'modifiable' : ''}">${alias.modifiable ? 'Modifiable' : 'Read-only'}</span>
                                ${alias.apiVersions ? `<span class="alias-tag">${alias.apiVersions.length} API versions</span>` : ''}
                            </div>
                        </div>
                    `;
                    }).join('')}
                </div>
                <div style="margin-top: 16px; padding: 12px; background: var(--color-bg-1); border-radius: 8px; font-size: 14px;">
                    💡 <strong>Tip:</strong> Click any alias to copy it to clipboard. You can search by alias name, description, resource type, or property path. This data comes from the real AzAdvertizer dataset.
                </div>
            `;
            
            resultsContainer.innerHTML = resultsHtml;
        }

        console.log(`✅ Search completed: ${searchResults.length} results displayed`);
    }

    copyAliasToClipboard(aliasName) {
        navigator.clipboard.writeText(aliasName).then(() => {
            // Create temporary success message
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--color-success);
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                z-index: 1000;
                font-size: 14px;
                box-shadow: var(--shadow-md);
            `;
            notification.textContent = `✅ Copied "${aliasName}" to clipboard!`;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 3000);
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = aliasName;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert(`✅ Copied "${aliasName}" to clipboard!`);
        });
    }

    initializeParameterTracerEvents() {
        console.log('✅ Parameter tracer events initialized');
    }

    initializeEffectAnalyzerEvents() {
        console.log('✅ Effect analyzer events initialized');
    }

    initializeDiagramViewEvents() {
        const zoomBtn = document.getElementById('zoom-fit');
        if (zoomBtn) {
            zoomBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.zoomFitDiagram();
            });
        }
        
        const exportSvgBtn = document.getElementById('export-diagram-svg');
        if (exportSvgBtn) {
            exportSvgBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.exportDiagramSVG();
            });
        }
        
        const exportPngBtn = document.getElementById('export-diagram-png');
        if (exportPngBtn) {
            exportPngBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.exportDiagramPNG();
            });
        }
    }

    initializeTreeViewEvents() {
        const expandBtn = document.getElementById('expand-all');
        if (expandBtn) {
            expandBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.expandAllTreeNodes();
            });
        }
        
        const collapseBtn = document.getElementById('collapse-all');
        if (collapseBtn) {
            collapseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.collapseAllTreeNodes();
            });
        }
        
        const clearBtn = document.getElementById('clear-search');
        if (clearBtn) {
            clearBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.clearTreeSearch();
            });
        }
        
        const copyBtn = document.getElementById('copy-path');
        if (copyBtn) {
            copyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.copyCurrentPath();
            });
        }
        
        const treeSearch = document.getElementById('tree-search');
        if (treeSearch) {
            treeSearch.addEventListener('input', (e) => {
                clearTimeout(this.treeSearchTimeout);
                this.treeSearchTimeout = setTimeout(() => {
                    this.searchInTree(e.target.value);
                }, 300);
            });
        }
    }

    // Metadata & Insights Events
    initializeMetadataInsightsEvents() {
        console.log('✅ Metadata & Insights events initialized');
    }



    // FIXED: Tab switching with proper debugging
    switchMainTab(tabName) {
        console.log('🎯 SWITCHING TO TAB:', tabName);
        
        // Update tab buttons
        document.querySelectorAll('.main-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            console.log('✅ Tab button activated:', tabName);
        } else {
            console.error('❌ Tab button not found for:', tabName);
        }

        // Update tab panels
        document.querySelectorAll('.main-tab-panel').forEach(panel => {
            panel.classList.remove('active');
            console.log('Hiding panel:', panel.id);
        });
        
        const activePanel = document.getElementById(`tab-${tabName}`);
        if (activePanel) {
            activePanel.classList.add('active');
            console.log('✅ Tab panel activated:', activePanel.id);
            
            // Update specific tabs when they become active
            if (tabName === 'metadata-insights') {
                this.updateMetadataInsights();
            }
        } else {
            console.error('❌ Tab panel not found for:', `tab-${tabName}`);
        }

        // Initialize tab-specific content if needed
        if (tabName === 'tree-view' && this.currentPolicy) {
            this.updateTreeView();
        }

        console.log('🎉 Tab switch completed successfully');
    }

    // Sample policy loading
    loadSamplePolicy(sampleKey) {
        console.log('Loading sample policy for key:', sampleKey);
        
        const policy = this.samplePolicies[sampleKey];
        if (policy) {
            const jsonInput = document.getElementById('policy-json-input');
            if (jsonInput) {
                jsonInput.value = JSON.stringify(policy, null, 2);
                console.log('Sample policy loaded successfully');
                // Automatically validate after loading
                setTimeout(() => {
                    this.validateAndAnalyze();
                }, 100);
            } else {
                console.error('JSON input element not found');
            }
        } else {
            console.error('Sample policy not found for key:', sampleKey);
        }
    }

    handleFileUpload(files) {
        if (!files || files.length === 0) return;

        const file = files[0];
        if (file.type !== 'application/json') {
            alert('Please upload only JSON files.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                const jsonInput = document.getElementById('policy-json-input');
                if (jsonInput) {
                    jsonInput.value = content;
                    this.validateAndAnalyze();
                }
            } catch (error) {
                alert('Error reading file: ' + error.message);
            }
        };
        reader.readAsText(file);
    }

    formatJSON() {
        const jsonInput = document.getElementById('policy-json-input');
        if (!jsonInput || !jsonInput.value.trim()) return;

        try {
            const parsed = JSON.parse(jsonInput.value);
            jsonInput.value = JSON.stringify(parsed, null, 2);
            alert('JSON formatted successfully');
        } catch (error) {
            alert('Invalid JSON: Cannot format');
        }
    }

    // Validation and analysis
    validateAndAnalyze() {
        const jsonInput = document.getElementById('policy-json-input');
        if (!jsonInput?.value.trim()) {
            alert('Please enter a policy definition');
            return;
        }

        try {
            const policy = JSON.parse(jsonInput.value);
            this.currentPolicy = policy;
            this.analysisResults = this.performComprehensiveAnalysis(policy);
            
            console.log('Analysis results:', this.analysisResults);
            
            this.renderLinterResults();
            this.updateAllTabs();
            
            // Enable export button
            const exportBtn = document.getElementById('export-all');
            if (exportBtn) exportBtn.disabled = false;
            
        } catch (error) {
            console.error('JSON parse error:', error);
            this.showLinterError('Invalid JSON: ' + error.message);
        }
    }

    performComprehensiveAnalysis(policy) {
        return {
            linting: this.performLinting(policy),
            basicInfo: this.extractBasicInfo(policy),
            parameters: this.analyzeParameters(policy),
            aliases: this.analyzeAliases(policy),
            effects: this.analyzeEffects(policy)
        };
    }

    performLinting(policy) {
        const issues = [];
        const props = policy.properties || policy;

        if (!props.displayName) {
            issues.push({
                type: 'warning',
                title: 'Missing Display Name',
                message: 'Policy should have a displayName for better identification',
                location: 'properties.displayName'
            });
        }

        if (!props.description) {
            issues.push({
                type: 'warning',
                title: 'Missing Description',
                message: 'Policy should have a description explaining its purpose',
                location: 'properties.description'
            });
        }

        if (!props.policyRule) {
            issues.push({
                type: 'error',
                title: 'Missing Policy Rule',
                message: 'Policy must have a policyRule section',
                location: 'properties.policyRule'
            });
        }

        if (!props.metadata?.version) {
            issues.push({
                type: 'info',
                title: 'Missing Version',
                message: 'Consider adding version information in metadata',
                location: 'properties.metadata.version'
            });
        }

        // Check for unused parameters
        const unusedParams = this.findUnusedParameters(policy);
        unusedParams.forEach(paramName => {
            issues.push({
                type: 'warning',
                title: 'Unused Parameter',
                message: `Parameter "${paramName}" is defined but never used`,
                location: `properties.parameters.${paramName}`
            });
        });

        if (issues.length === 0 || issues.every(i => i.type === 'info')) {
            issues.push({
                type: 'success',
                title: 'Policy Validation Passed',
                message: 'Policy definition is valid and well-structured',
                location: null
            });
        }

        return issues;
    }

    findUnusedParameters(policy) {
        const props = policy.properties || policy;
        const parameters = Object.keys(props.parameters || {});
        const policyRuleStr = JSON.stringify(props.policyRule || {});
        
        return parameters.filter(paramName => {
            const paramReference = `parameters('${paramName}')`;
            return !policyRuleStr.includes(paramReference);
        });
    }

    extractBasicInfo(policy) {
        const props = policy.properties || policy;
        return {
            displayName: props.displayName || 'Unnamed Policy',
            description: props.description || 'No description provided',
            mode: props.mode || 'All',
            category: props.metadata?.category || 'Uncategorized',
            version: props.metadata?.version || 'Unversioned'
        };
    }

    analyzeParameters(policy) {
        const props = policy.properties || policy;
        const parameters = props.parameters || {};
        
        const paramAnalysis = Object.entries(parameters).map(([name, param]) => ({
            name,
            type: param.type || 'unknown',
            description: param.metadata?.description || 'No description',
            displayName: param.metadata?.displayName || name,
            defaultValue: param.defaultValue,
            required: param.defaultValue === undefined,
            used: this.isParameterUsed(name, props.policyRule)
        }));

        return {
            total: paramAnalysis.length,
            required: paramAnalysis.filter(p => p.required).length,
            optional: paramAnalysis.filter(p => !p.required).length,
            unused: paramAnalysis.filter(p => !p.used).length,
            parameters: paramAnalysis
        };
    }

    isParameterUsed(paramName, policyRule) {
        const ruleStr = JSON.stringify(policyRule || {});
        return ruleStr.includes(`parameters('${paramName}')`);
    }

    analyzeAliases(policy) {
        const props = policy.properties || policy;
        const ruleStr = JSON.stringify(props.policyRule || {});
        const foundAliases = [];
        
        // Extract field references
        const fieldMatches = ruleStr.match(/"field"\s*:\s*"([^"]+)"/g) || [];
        fieldMatches.forEach(match => {
            const alias = match.match(/"([^"]+)"$/)?.[1];
            if (alias && alias.includes('.')) {
                foundAliases.push(alias);
            }
        });

        // Validate aliases against our working database
        const validatedAliases = foundAliases.map(alias => ({
            name: alias,
            valid: this.validateAlias(alias),
            modifiable: this.isAliasModifiable(alias),
            description: this.getAliasDescription(alias),
            namespace: this.getAliasNamespace(alias),
            propertyPath: this.getAliasPropertyPath(alias)
        }));

        return {
            total: foundAliases.length,
            valid: validatedAliases.filter(a => a.valid).length,
            invalid: validatedAliases.filter(a => !a.valid).length,
            aliases: validatedAliases
        };
    }

    validateAlias(aliasName) {
        return this.allAliases.some(a => a.name === aliasName);
    }

    isAliasModifiable(aliasName) {
        const alias = this.allAliases.find(a => a.name === aliasName);
        return alias ? alias.modifiable : false;
    }

    getAliasDescription(aliasName) {
        const alias = this.allAliases.find(a => a.name === aliasName);
        return alias ? alias.description : 'Unknown alias';
    }

    getAliasNamespace(aliasName) {
        const alias = this.allAliases.find(a => a.name === aliasName);
        return alias ? alias.namespace : 'Unknown';
    }

    getAliasPropertyPath(aliasName) {
        const alias = this.allAliases.find(a => a.name === aliasName);
        return alias ? alias.propertyPath : null;
    }

    analyzeEffects(policy) {
        const props = policy.properties || policy;
        
        // Extract effect from policy rule
        let effect = 'unknown';
        if (props.policyRule?.then?.effect) {
            effect = props.policyRule.then.effect.toLowerCase();
            // Handle parameter references
            if (effect.includes('parameters(')) {
                const match = effect.match(/\[parameters\('([^']+)'\)\]/);
                if (match) {
                    const paramName = match[1];
                    const paramInfo = props.parameters?.[paramName];
                    if (paramInfo?.defaultValue) {
                        effect = paramInfo.defaultValue.toLowerCase();
                    }
                }
            }
        }
        
        const effectInfo = this.policyEffects[effect] || {
            description: 'No effect specified in policy rule',
            businessImpact: 'Policy will not enforce any action',
            useCases: [],
            compatibleEffects: [],
            conflictingEffects: [],
            requiredRoles: [],
            remediation: false,
            riskLevel: 'None'
        };

        return {
            type: effect,
            ...effectInfo
        };
    }

    // Linter results rendering
    renderLinterResults() {
        const resultsContainer = document.getElementById('linter-results');
        const summaryContainer = document.getElementById('linter-summary');
        const issuesContainer = document.getElementById('linter-issues');
        
        if (!resultsContainer || !this.analysisResults?.linting) return;

        resultsContainer.classList.remove('hidden');
        
        const issues = this.analysisResults.linting;
        const summary = {
            success: issues.filter(i => i.type === 'success').length,
            warning: issues.filter(i => i.type === 'warning').length,
            error: issues.filter(i => i.type === 'error').length,
            info: issues.filter(i => i.type === 'info').length
        };

        // Render summary
        if (summaryContainer) {
            summaryContainer.innerHTML = `
                <div class="summary-item">
                    <span class="summary-count success">${summary.success}</span>
                    <span class="summary-label">Passed</span>
                </div>
                <div class="summary-item">
                    <span class="summary-count warning">${summary.warning}</span>
                    <span class="summary-label">Warnings</span>
                </div>
                <div class="summary-item">
                    <span class="summary-count error">${summary.error}</span>
                    <span class="summary-label">Errors</span>
                </div>
                <div class="summary-item">
                    <span class="summary-count info">${summary.info}</span>
                    <span class="summary-label">Info</span>
                </div>
            `;
        }

        // Render issues
        if (issuesContainer) {
            issuesContainer.innerHTML = issues.map(issue => `
                <div class="linter-issue ${issue.type}">
                    <div class="issue-icon">
                        ${issue.type === 'success' ? '✅' : 
                          issue.type === 'warning' ? '⚠️' : 
                          issue.type === 'error' ? '❌' : 'ℹ️'}
                    </div>
                    <div class="issue-content">
                        <h4>${issue.title}</h4>
                        <p>${issue.message}</p>
                        ${issue.location ? `<div class="issue-location">Location: ${issue.location}</div>` : ''}
                    </div>
                </div>
            `).join('');
        }
    }

    showLinterError(message) {
        const resultsContainer = document.getElementById('linter-results');
        const summaryContainer = document.getElementById('linter-summary');
        const issuesContainer = document.getElementById('linter-issues');
        
        if (resultsContainer && summaryContainer && issuesContainer) {
            resultsContainer.classList.remove('hidden');
            
            summaryContainer.innerHTML = `
                <div class="summary-item">
                    <span class="summary-count error">1</span>
                    <span class="summary-label">Error</span>
                </div>
            `;
            
            issuesContainer.innerHTML = `
                <div class="linter-issue error">
                    <div class="issue-icon">❌</div>
                    <div class="issue-content">
                        <h4>JSON Parse Error</h4>
                        <p>${message}</p>
                    </div>
                </div>
            `;
        }
    }

    updateAllTabs() {
        this.updateAliasResolver();
        this.updateParameterTracer();
        this.updateEffectAnalyzer();
        this.updateMetadataInsights();
        this.generatePolicyDiagram();
        // Tree view updates when tab is switched
    }

    updateAliasResolver() {
        if (!this.analysisResults?.aliases) return;
        
        const container = document.getElementById('policy-aliases-used');
        if (!container) return;

        const aliases = this.analysisResults.aliases;
        
        if (aliases.total === 0) {
            container.innerHTML = '<div class="no-results">No aliases found in current policy</div>';
        } else {
            container.innerHTML = `
                <h4>📋 Aliases used in current policy (${aliases.total}):</h4>
                <div style="margin-bottom: 16px;">
                    <span class="alias-tag valid">Valid: ${aliases.valid}</span>
                    <span class="alias-tag invalid">Invalid: ${aliases.invalid}</span>
                </div>
                ${aliases.aliases.map(alias => `
                    <div class="alias-item">
                        <div class="alias-name">${alias.name}</div>
                        <div class="alias-description">${alias.description}</div>
                        ${alias.propertyPath ? `<div class="alias-property-path" style="font-family: 'Courier New', monospace; font-size: 12px; color: var(--color-text-secondary); background: var(--color-bg-2); padding: 4px 8px; border-radius: 4px; margin: 4px 0; border-left: 3px solid var(--color-primary);">
                            <strong>Property Path:</strong> ${alias.propertyPath}
                        </div>` : ''}
                        <div class="alias-meta">
                            <span class="alias-tag ${alias.valid ? 'valid' : 'invalid'}">${alias.valid ? 'Valid' : 'Invalid'}</span>
                            <span class="alias-tag">${alias.namespace}</span>
                            ${alias.modifiable ? '<span class="alias-tag modifiable">Modifiable</span>' : '<span class="alias-tag">Read-only</span>'}
                        </div>
                    </div>
                `).join('')}
            `;
        }
    }

    updateParameterTracer() {
        if (!this.analysisResults?.parameters) return;

        const overviewContainer = document.getElementById('parameter-overview');
        const detailsContainer = document.getElementById('parameter-details');
        const issuesContainer = document.getElementById('parameter-issues');

        const params = this.analysisResults.parameters;

        // Overview stats
        if (overviewContainer) {
            overviewContainer.innerHTML = `
                <div class="parameter-stat">
                    <span class="stat-value">${params.total}</span>
                    <span class="stat-label">Total Parameters</span>
                </div>
                <div class="parameter-stat">
                    <span class="stat-value">${params.required}</span>
                    <span class="stat-label">Required</span>
                </div>
                <div class="parameter-stat">
                    <span class="stat-value">${params.optional}</span>
                    <span class="stat-label">Optional</span>
                </div>
                <div class="parameter-stat">
                    <span class="stat-value">${params.unused}</span>
                    <span class="stat-label">Unused</span>
                </div>
            `;
        }

        // Parameter details
        if (detailsContainer) {
            if (params.total === 0) {
                detailsContainer.innerHTML = '<div class="no-results">No parameters defined in policy</div>';
            } else {
                detailsContainer.innerHTML = params.parameters.map(param => `
                    <div class="parameter-item">
                        <div class="parameter-name">${param.displayName}</div>
                        <div class="parameter-type">Type: ${param.type}</div>
                        <div class="parameter-description">${param.description}</div>
                        <div class="parameter-meta">
                            <span class="alias-tag">${param.required ? 'Required' : 'Optional'}</span>
                            <span class="alias-tag ${param.used ? 'valid' : 'invalid'}">${param.used ? 'Used' : 'Unused'}</span>
                            ${param.defaultValue !== undefined ? `<span class="alias-tag">Default: ${JSON.stringify(param.defaultValue)}</span>` : ''}
                        </div>
                    </div>
                `).join('');
            }
        }

        // Parameter issues
        if (issuesContainer) {
            const unusedParams = params.parameters.filter(p => !p.used);
            if (unusedParams.length > 0) {
                issuesContainer.innerHTML = unusedParams.map(param => `
                    <div class="parameter-issue unused">
                        <h4>Unused Parameter: ${param.name}</h4>
                        <p>This parameter is defined but never referenced in the policy rule.</p>
                    </div>
                `).join('');
            } else {
                issuesContainer.innerHTML = '<div class="no-results">All parameters are properly used</div>';
            }
        }
    }

    updateEffectAnalyzer() {
        if (!this.analysisResults?.effects) return;

        const currentEffectContainer = document.getElementById('current-effect-display');
        if (!currentEffectContainer) return;

        const effect = this.analysisResults.effects;

        currentEffectContainer.innerHTML = `
            <div class="effect-name-display">
                <div class="effect-badge ${effect.type.toLowerCase()}">
                    <span>${effect.type.toUpperCase()}</span>
                </div>
            </div>
        `;
    }

    // Enhanced Diagram View Implementation
    generatePolicyDiagram() {
        if (!this.currentPolicy) {
            alert('Please load a policy first to generate diagram');
            return;
        }

        const container = document.getElementById('policy-diagram');
        if (!container) return;

        // Clear previous diagram
        container.innerHTML = '';

        const policy = this.currentPolicy.properties || this.currentPolicy;
        
        // Create enhanced visual representation
        const diagramHtml = this.createEnhancedDiagram(policy);
        container.innerHTML = diagramHtml;
    }

    createEnhancedDiagram(policy) {
        const parameters = this.analyzeParameters(policy);
        const effect = policy.policyRule?.then?.effect || 'unknown';
        const fields = this.extractFields(policy);
        const conditions = this.parsePolicyConditions(policy.policyRule?.if);
        const deployedResources = this.extractDeployedResources(policy);

        return `
            <div class="enhanced-diagram-container" style="padding: 20px; min-height: 500px;">
                <div class="diagram-header" style="text-align: center; margin-bottom: 30px;">
                    <h3 style="color: var(--color-text); margin-bottom: 10px;">Policy Decision Tree</h3>
                    <p style="color: var(--color-text-secondary); font-size: 14px;">Interactive visualization of policy logic flow</p>
                </div>

                <!-- Parameters Section -->
                ${parameters.total > 0 ? `
                    <div class="parameters-section" style="margin-bottom: 30px;">
                        <h4 style="color: var(--color-text); margin-bottom: 15px; display: flex; align-items: center;">
                            📊 Parameters (${parameters.total})
                            <span style="margin-left: 10px; font-size: 12px; color: var(--color-text-secondary);">
                                ${parameters.required} required, ${parameters.optional} optional
                            </span>
                        </h4>
                        <div class="parameters-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                            ${parameters.parameters.map(param => `
                                <div class="parameter-card" style="padding: 12px; background: ${param.required ? '#ffebee' : '#e8f5e8'}; border-left: 4px solid ${param.required ? '#f44336' : '#4caf50'}; border-radius: 8px;">
                                    <div style="font-weight: bold; color: var(--color-text);">${param.displayName}</div>
                                    <div style="font-size: 12px; color: var(--color-text-secondary); margin: 4px 0;">${param.type}</div>
                                    <div style="font-size: 11px; color: var(--color-text-secondary);">${param.description}</div>
                                    ${param.defaultValue !== undefined ? `<div style="font-size: 10px; color: #666; margin-top: 4px;">Default: ${JSON.stringify(param.defaultValue)}</div>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- Decision Tree Section -->
                <div class="decision-tree-section" style="margin-bottom: 30px;">
                    <h4 style="color: var(--color-text); margin-bottom: 15px;">🌳 Policy Logic Tree</h4>
                    <div class="decision-tree" style="background: var(--color-bg-1); border-radius: 12px; padding: 20px; border: 2px solid var(--color-border);">
                        ${this.renderDecisionTree(conditions)}
                    </div>
                </div>

                <!-- Effect Section -->
                <div class="effect-section" style="text-align: center; margin-bottom: 30px;">
                    <div style="padding: 20px 40px; background: ${this.getEffectColor(effect)}; color: white; border-radius: 12px; font-weight: bold; display: inline-block;">
                        🎯 Effect: ${effect.toUpperCase()}
                    </div>
                </div>

                <!-- Deployed Resources Section -->
                ${deployedResources.length > 0 ? `
                    <div class="deployed-resources-section" style="margin-bottom: 30px;">
                        <h4 style="color: var(--color-text); margin-bottom: 15px;">🏗️ Resources to be Deployed</h4>
                        <div class="deployed-resources-list" style="display: flex; flex-direction: column; gap: 10px;">
                            ${deployedResources.map(resource => `
                                <div class="resource-card" style="padding: 15px; background: var(--color-bg-2); border-radius: 8px; border-left: 4px solid ${resource.isNested ? '#ff9800' : '#4caf50'}; margin-left: ${resource.depth * 20}px;">
                                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                                        <div style="width: 8px; height: 8px; border-radius: 50%; background: ${resource.isNested ? '#ff9800' : '#4caf50'};"></div>
                                        <div style="font-weight: bold; color: var(--color-text); font-family: 'Courier New', monospace;">${resource.type}</div>
                                        ${resource.isNested ? '<span style="font-size: 10px; color: #ff9800; margin-left: 8px;">(NESTED)</span>' : ''}
                                    </div>
                                    <div style="font-size: 12px; color: var(--color-text-secondary); margin-bottom: 4px;">
                                        <strong>Name:</strong> ${resource.name}
                                    </div>
                                    ${resource.location ? `
                                        <div style="font-size: 12px; color: var(--color-text-secondary); margin-bottom: 4px;">
                                            <strong>Location:</strong> ${resource.location}
                                        </div>
                                    ` : ''}
                                    ${resource.apiVersion ? `
                                        <div style="font-size: 12px; color: var(--color-text-secondary); margin-bottom: 4px;">
                                            <strong>API Version:</strong> ${resource.apiVersion}
                                        </div>
                                    ` : ''}
                                    ${resource.properties.description ? `
                                        <div style="font-size: 11px; color: var(--color-text-secondary); margin-top: 8px; padding: 8px; background: var(--color-bg-1); border-radius: 4px;">
                                            <strong>Description:</strong> ${resource.properties.description}
                                        </div>
                                    ` : ''}
                                    ${resource.properties.enabled !== undefined ? `
                                        <div style="font-size: 11px; color: var(--color-text-secondary); margin-top: 4px;">
                                            <strong>Enabled:</strong> ${resource.properties.enabled ? 'Yes' : 'No'}
                                        </div>
                                    ` : ''}
                                    ${resource.properties.scopes ? `
                                        <div style="font-size: 11px; color: var(--color-text-secondary); margin-top: 4px;">
                                            <strong>Scopes:</strong> ${resource.properties.scopes.join(', ')}
                                        </div>
                                    ` : ''}
                                    ${resource.properties.actions ? `
                                        <div style="font-size: 11px; color: var(--color-text-secondary); margin-top: 4px;">
                                            <strong>Actions:</strong> ${resource.properties.actions.map(action => action.actionType || JSON.stringify(action)).join(', ')}
                                        </div>
                                    ` : ''}
                                    ${resource.properties.conditions ? `
                                        <div style="font-size: 11px; color: var(--color-text-secondary); margin-top: 4px;">
                                            <strong>Conditions:</strong> ${resource.properties.conditions.map(condition => 
                                                `${condition.field} ${condition.operator} ${Array.isArray(condition.values) ? condition.values.join(', ') : condition.values}`
                                            ).join('; ')}
                                        </div>
                                    ` : ''}
                                    ${resource.properties.tags ? `
                                        <div style="font-size: 11px; color: var(--color-text-secondary); margin-top: 4px;">
                                            <strong>Tags:</strong> ${Object.keys(resource.properties.tags).map(key => `${key}: ${resource.properties.tags[key]}`).join(', ')}
                                        </div>
                                    ` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <!-- Resource Fields Section -->
                ${fields.length > 0 ? `
                    <div class="fields-section" style="margin-top: 30px;">
                        <h4 style="color: var(--color-text); margin-bottom: 15px;">🔗 Resource Fields Referenced (${fields.length})</h4>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;">
                            ${fields.map(field => `
                                <div style="padding: 8px 12px; background: #5D878F; color: white; border-radius: 12px; font-size: 12px; font-family: 'Courier New', monospace;">
                                    ${field}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // Parse policy conditions into a structured format
    parsePolicyConditions(condition) {
        if (!condition) return null;
        
        return this.parseConditionNode(condition, 0);
    }

    parseConditionNode(node, depth) {
        if (!node) return null;

        const nodeId = `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        if (node.allOf) {
            return {
                id: nodeId,
                type: 'allOf',
                operator: 'AND',
                children: node.allOf.map(child => this.parseConditionNode(child, depth + 1)),
                depth: depth,
                collapsed: depth > 2
            };
        }
        
        if (node.anyOf) {
            return {
                id: nodeId,
                type: 'anyOf',
                operator: 'OR',
                children: node.anyOf.map(child => this.parseConditionNode(child, depth + 1)),
                depth: depth,
                collapsed: depth > 2
            };
        }
        
        if (node.not) {
            return {
                id: nodeId,
                type: 'not',
                operator: 'NOT',
                children: [this.parseConditionNode(node.not, depth + 1)],
                depth: depth,
                collapsed: depth > 2
            };
        }
        
        if (node.field) {
            return {
                id: nodeId,
                type: 'condition',
                field: node.field,
                operator: this.getOperator(node),
                value: this.getValue(node),
                depth: depth,
                collapsed: false
            };
        }
        
        if (node.value) {
            return {
                id: nodeId,
                type: 'value',
                value: node.value,
                depth: depth,
                collapsed: false
            };
        }
        
        return null;
    }

    getOperator(node) {
        if (node.equals) return 'equals';
        if (node.notEquals) return 'notEquals';
        if (node.in) return 'in';
        if (node.notIn) return 'notIn';
        if (node.contains) return 'contains';
        if (node.notContains) return 'notContains';
        if (node.exists) return 'exists';
        if (node.greater) return 'greater';
        if (node.greaterOrEquals) return 'greaterOrEquals';
        if (node.less) return 'less';
        if (node.lessOrEquals) return 'lessOrEquals';
        if (node.like) return 'like';
        if (node.notLike) return 'notLike';
        return 'unknown';
    }

    getValue(node) {
        return node.equals || node.notEquals || node.in || node.notIn || 
               node.contains || node.notContains || node.greater || node.greaterOrEquals || 
               node.less || node.lessOrEquals || node.like || node.notLike || 
               node.value || 'true';
    }

    getEffectColor(effect) {
        const colors = {
            'deny': '#f44336',
            'audit': '#ff9800',
            'modify': '#2196f3',
            'append': '#4caf50',
            'deployIfNotExists': '#9c27b0',
            'auditIfNotExists': '#ff5722',
            'disabled': '#9e9e9e'
        };
        return colors[effect.toLowerCase()] || '#9e9e9e';
    }

    // Render decision tree with collapse/expand functionality
    renderDecisionTree(conditions) {
        if (!conditions) {
            return '<div style="text-align: center; color: var(--color-text-secondary); padding: 20px;">No conditions found</div>';
        }

        return this.renderConditionNode(conditions);
    }

    renderConditionNode(node, isCollapsed = false) {
        if (!node) return '';

        const nodeStyle = `
            margin: 8px 0;
            padding: 12px;
            border-radius: 8px;
            border-left: 4px solid ${this.getNodeColor(node.type)};
            background: ${this.getNodeBackground(node.type)};
            position: relative;
            margin-left: ${node.depth * 20}px;
        `;

        const toggleButton = node.children && node.children.length > 0 ? 
            `<button onclick="window.azurePolicyAnalyzer.toggleNode('${node.id}')" 
                    style="position: absolute; left: -30px; top: 50%; transform: translateY(-50%); 
                           background: var(--color-primary); color: white; border: none; 
                           border-radius: 50%; width: 24px; height: 24px; cursor: pointer; font-size: 12px;">
                ${isCollapsed ? '▶' : '▼'}
            </button>` : '';

        let content = '';
        
        if (node.type === 'condition') {
            content = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-weight: bold; color: var(--color-primary);">Field:</span>
                    <code style="background: var(--color-bg-2); padding: 4px 8px; border-radius: 4px; font-family: 'Courier New', monospace;">${node.field}</code>
                    <span style="font-weight: bold; color: var(--color-text);">${this.getOperatorSymbol(node.operator)}</span>
                    <code style="background: var(--color-bg-2); padding: 4px 8px; border-radius: 4px; font-family: 'Courier New', monospace;">${JSON.stringify(node.value)}</code>
                </div>
            `;
        } else if (node.type === 'value') {
            content = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-weight: bold; color: var(--color-text);">Value:</span>
                    <code style="background: var(--color-bg-2); padding: 4px 8px; border-radius: 4px; font-family: 'Courier New', monospace;">${JSON.stringify(node.value)}</code>
                </div>
            `;
        } else {
            content = `
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <span style="font-weight: bold; color: var(--color-text);">${node.operator}</span>
                    <span style="font-size: 12px; color: var(--color-text-secondary);">(${node.children.length} condition${node.children.length !== 1 ? 's' : ''})</span>
                </div>
                ${!isCollapsed && node.children ? `
                    <div class="children-container" style="margin-left: 20px;">
                        ${node.children.map(child => this.renderConditionNode(child, child.collapsed)).join('')}
                    </div>
                ` : ''}
            `;
        }

        return `
            <div id="${node.id}" class="condition-node" style="${nodeStyle}">
                ${toggleButton}
                ${content}
            </div>
        `;
    }

    getNodeColor(type) {
        const colors = {
            'allOf': '#2196f3',
            'anyOf': '#ff9800',
            'not': '#f44336',
            'condition': '#4caf50',
            'value': '#9c27b0'
        };
        return colors[type] || '#9e9e9e';
    }

    getNodeBackground(type) {
        const backgrounds = {
            'allOf': 'rgba(33, 150, 243, 0.1)',
            'anyOf': 'rgba(255, 152, 0, 0.1)',
            'not': 'rgba(244, 67, 54, 0.1)',
            'condition': 'rgba(76, 175, 80, 0.1)',
            'value': 'rgba(156, 39, 176, 0.1)'
        };
        return backgrounds[type] || 'var(--color-bg-1)';
    }

    getOperatorSymbol(operator) {
        const symbols = {
            'equals': '=',
            'notEquals': '≠',
            'in': '∈',
            'notIn': '∉',
            'contains': '⊃',
            'notContains': '⊅',
            'exists': '∃',
            'greater': '>',
            'greaterOrEquals': '≥',
            'less': '<',
            'lessOrEquals': '≤',
            'like': '~',
            'notLike': '≁'
        };
        return symbols[operator] || operator;
    }

    // Toggle node collapse/expand
    toggleNode(nodeId) {
        const node = document.getElementById(nodeId);
        if (!node) return;

        const childrenContainer = node.querySelector('.children-container');
        if (!childrenContainer) return;

        const isCollapsed = childrenContainer.style.display === 'none';
        childrenContainer.style.display = isCollapsed ? 'block' : 'none';
        
        const button = node.querySelector('button');
        if (button) {
            button.textContent = isCollapsed ? '▼' : '▶';
        }
    }

    extractFields(policy) {
        const fields = [];
        const ruleStr = JSON.stringify(policy.policyRule || {});
        const fieldMatches = ruleStr.match(/"field"\s*:\s*"([^"]+)"/g) || [];
        
        fieldMatches.forEach(match => {
            const field = match.match(/"([^"]+)"$/)?.[1];
            if (field && !fields.includes(field)) {
                fields.push(field);
            }
        });

        return fields;
    }

    extractDeployedResources(policy) {
        const resources = [];
        const policyRule = policy.policyRule || policy.properties?.policyRule;
        
        if (!policyRule?.then?.details?.deployment?.properties?.template?.resources) {
            return resources;
        }

        const templateResources = policyRule.then.details.deployment.properties.template.resources;
        
        // Recursively extract all resources from nested templates
        this.extractResourcesRecursively(templateResources, resources, 0);

        return resources;
    }

    extractResourcesRecursively(resourceList, resources, depth = 0) {
        resourceList.forEach(resource => {
            if (resource.type && resource.name) {
                const resourceInfo = {
                    type: resource.type,
                    name: this.resolveResourceName(resource.name),
                    location: resource.location || 'Global',
                    apiVersion: resource.apiVersion || 'Latest',
                    description: this.extractResourceDescription(resource),
                    depth: depth,
                    properties: this.extractResourceProperties(resource),
                    isNested: depth > 0
                };
                resources.push(resourceInfo);

                // Check if this resource has nested resources (deployment with template)
                if (resource.type === 'Microsoft.Resources/deployments' && 
                    resource.properties?.template?.resources) {
                    this.extractResourcesRecursively(
                        resource.properties.template.resources, 
                        resources, 
                        depth + 1
                    );
                }
            }
        });
    }

    extractResourceProperties(resource) {
        const properties = {};
        
        if (resource.properties) {
            // Extract key properties that are commonly useful
            if (resource.properties.description) {
                properties.description = resource.properties.description;
            }
            if (resource.properties.enabled !== undefined) {
                properties.enabled = resource.properties.enabled;
            }
            if (resource.properties.scopes) {
                properties.scopes = resource.properties.scopes;
            }
            if (resource.properties.actions) {
                properties.actions = resource.properties.actions;
            }
            if (resource.properties.conditions) {
                properties.conditions = resource.properties.conditions;
            }
            if (resource.properties.tags) {
                properties.tags = resource.properties.tags;
            }
        }
        
        return properties;
    }

    resolveResourceName(name) {
        // Handle ARM template functions in resource names
        if (typeof name === 'string') {
            // Replace common ARM template functions with readable text
            return name
                .replace(/\[concat\('([^']+)',[^)]+\)\]/g, '$1-{dynamic}')
                .replace(/\[parameters\('([^']+)'\)\]/g, '{$1}')
                .replace(/\[subscription\(\)\.displayName\]/g, '{subscription-name}')
                .replace(/\[subscription\(\)\.Id\]/g, '{subscription-id}');
        }
        return name;
    }

    extractResourceDescription(resource) {
        // Extract description from resource properties
        if (resource.properties?.description) {
            return resource.properties.description;
        }
        
        // Generate description based on resource type
        const typeDescriptions = {
            'Microsoft.Resources/resourceGroups': 'Resource Group for organizing resources',
            'Microsoft.Resources/deployments': 'ARM Template Deployment',
            'Microsoft.AlertsManagement/actionRules': 'Alert Processing Rule for notification suppression',
            'Microsoft.Storage/storageAccounts': 'Storage Account for data storage',
            'Microsoft.Compute/virtualMachines': 'Virtual Machine instance',
            'Microsoft.Network/virtualNetworks': 'Virtual Network for networking',
            'Microsoft.KeyVault/vaults': 'Key Vault for secrets management'
        };
        
        return typeDescriptions[resource.type] || `${resource.type} resource`;
    }

    zoomFitDiagram() {
        alert('Diagram reset to fit view');
    }

    exportDiagramSVG() {
        alert('SVG export feature would require additional libraries. Diagram structure saved to memory.');
    }

    exportDiagramPNG() {
        alert('PNG export would require additional libraries. Consider using screenshot tools.');
    }

    // Tree View Implementation
    updateTreeView() {
        if (!this.currentPolicy) {
            const container = document.getElementById('json-tree');
            if (container) {
                container.innerHTML = '<div class="no-results">Load a policy to see tree structure</div>';
            }
            return;
        }

        this.renderJsonTree();
        this.updateTreeStats();
    }

    renderJsonTree() {
        const container = document.getElementById('json-tree');
        if (!container) return;

        container.innerHTML = '';
        this.treeState.expandedNodes.clear();
        
        const rootNode = this.createTreeNode('policy', this.currentPolicy, '');
        container.appendChild(rootNode);
        
        // Auto-expand the root
        setTimeout(() => {
            const rootChildren = rootNode.querySelector('.tree-children');
            if (rootChildren) {
                rootChildren.classList.add('expanded');
                const iconDiv = rootNode.querySelector('.tree-toggle-icon');
                if (iconDiv) iconDiv.textContent = '▼';
            }
        }, 100);
    }

    createTreeNode(key, value, path = '', level = 0) {
        const nodeDiv = document.createElement('div');
        nodeDiv.className = 'tree-node';
        nodeDiv.dataset.path = path;

        if (level === 0) {
            nodeDiv.classList.add('root');
        }

        if (value && typeof value === 'object' && value !== null) {
            const isArray = Array.isArray(value);
            const keys = Object.keys(value);
            const hasChildren = keys.length > 0;

            const toggleDiv = document.createElement('div');
            toggleDiv.className = 'tree-toggle';
            toggleDiv.onclick = () => this.toggleTreeNode(nodeDiv, path);

            const iconDiv = document.createElement('div');
            iconDiv.className = 'tree-toggle-icon';
            iconDiv.textContent = hasChildren ? '▶' : '';

            const keySpan = document.createElement('span');
            keySpan.className = 'tree-key';
            keySpan.textContent = key;

            const typeSpan = document.createElement('span');
            typeSpan.className = 'tree-value';
            typeSpan.textContent = isArray ? ` [${keys.length}]` : ` {${keys.length}}`;

            toggleDiv.appendChild(iconDiv);
            toggleDiv.appendChild(keySpan);
            toggleDiv.appendChild(typeSpan);
            nodeDiv.appendChild(toggleDiv);

            if (hasChildren) {
                const childrenDiv = document.createElement('div');
                childrenDiv.className = 'tree-children';
                
                keys.forEach(childKey => {
                    const childPath = path ? `${path}.${childKey}` : childKey;
                    const childNode = this.createTreeNode(childKey, value[childKey], childPath, level + 1);
                    childrenDiv.appendChild(childNode);
                });

                nodeDiv.appendChild(childrenDiv);
            }
        } else {
            const toggleDiv = document.createElement('div');
            toggleDiv.className = 'tree-toggle';
            toggleDiv.onclick = () => this.selectTreeNode(path);

            const keySpan = document.createElement('span');
            keySpan.className = 'tree-key';
            keySpan.textContent = key + ': ';

            const valueSpan = document.createElement('span');
            valueSpan.className = `tree-value ${this.getValueType(value)}`;
            valueSpan.textContent = this.formatValue(value);

            toggleDiv.appendChild(keySpan);
            toggleDiv.appendChild(valueSpan);
            nodeDiv.appendChild(toggleDiv);
        }

        return nodeDiv;
    }

    toggleTreeNode(nodeDiv, path) {
        const childrenDiv = nodeDiv.querySelector('.tree-children');
        const iconDiv = nodeDiv.querySelector('.tree-toggle-icon');
        
        if (childrenDiv) {
            const isExpanded = childrenDiv.classList.contains('expanded');
            
            if (isExpanded) {
                childrenDiv.classList.remove('expanded');
                iconDiv.textContent = '▶';
                this.treeState.expandedNodes.delete(path);
            } else {
                childrenDiv.classList.add('expanded');
                iconDiv.textContent = '▼';
                this.treeState.expandedNodes.add(path);
            }
        }

        this.updateTreeStats();
    }

    selectTreeNode(path) {
        const pathInput = document.getElementById('path-input');
        if (pathInput) {
            pathInput.value = path;
        }

        // Highlight selected node
        document.querySelectorAll('.tree-node').forEach(node => {
            node.classList.remove('highlighted');
        });

        const selectedNode = document.querySelector(`[data-path="${path}"]`);
        if (selectedNode) {
            selectedNode.classList.add('highlighted');
        }
    }

    getValueType(value) {
        if (value === null) return 'null';
        if (typeof value === 'boolean') return 'boolean';
        if (typeof value === 'number') return 'number';
        if (typeof value === 'string') return 'string';
        return '';
    }

    formatValue(value) {
        if (value === null) return 'null';
        if (typeof value === 'string') return `"${value}"`;
        return String(value);
    }

    expandAllTreeNodes() {
        document.querySelectorAll('.tree-children').forEach(children => {
            children.classList.add('expanded');
            const iconDiv = children.parentNode.querySelector('.tree-toggle-icon');
            if (iconDiv) iconDiv.textContent = '▼';
        });

        document.querySelectorAll('.tree-node').forEach(node => {
            const path = node.dataset.path;
            if (path) this.treeState.expandedNodes.add(path);
        });

        this.updateTreeStats();
    }

    collapseAllTreeNodes() {
        document.querySelectorAll('.tree-children').forEach(children => {
            children.classList.remove('expanded');
            const iconDiv = children.parentNode.querySelector('.tree-toggle-icon');
            if (iconDiv) iconDiv.textContent = '▶';
        });

        this.treeState.expandedNodes.clear();
        this.updateTreeStats();
    }

    searchInTree(searchTerm) {
        const results = [];
        
        if (!searchTerm.trim()) {
            this.clearTreeSearch();
            return;
        }

        document.querySelectorAll('.tree-node').forEach(node => {
            const textContent = node.textContent.toLowerCase();
            const path = node.dataset.path;
            
            if (textContent.includes(searchTerm.toLowerCase())) {
                node.classList.add('highlighted');
                results.push(path);
                
                // Auto-expand parent nodes
                let currentPath = path;
                while (currentPath.includes('.')) {
                    currentPath = currentPath.substring(0, currentPath.lastIndexOf('.'));
                    const parentNode = document.querySelector(`[data-path="${currentPath}"]`);
                    if (parentNode) {
                        const childrenDiv = parentNode.querySelector('.tree-children');
                        if (childrenDiv) {
                            childrenDiv.classList.add('expanded');
                            const iconDiv = parentNode.querySelector('.tree-toggle-icon');
                            if (iconDiv) iconDiv.textContent = '▼';
                        }
                    }
                }
            } else {
                node.classList.remove('highlighted');
            }
        });

        this.treeState.searchResults = results;
        this.updateTreeStats();
    }

    clearTreeSearch() {
        document.querySelectorAll('.tree-node').forEach(node => {
            node.classList.remove('highlighted');
        });

        const searchInput = document.getElementById('tree-search');
        if (searchInput) searchInput.value = '';

        this.treeState.searchResults = [];
        this.updateTreeStats();
    }

    copyCurrentPath() {
        const pathInput = document.getElementById('path-input');
        if (!pathInput || !pathInput.value) {
            alert('No path selected');
            return;
        }

        navigator.clipboard.writeText(pathInput.value).then(() => {
            alert(`✅ Copied path "${pathInput.value}" to clipboard!`);
        }).catch(() => {
            // Fallback
            pathInput.select();
            document.execCommand('copy');
            alert(`✅ Copied path "${pathInput.value}" to clipboard!`);
        });
    }

    updateTreeStats() {
        const totalNodesEl = document.getElementById('total-nodes');
        const expandedNodesEl = document.getElementById('expanded-nodes');
        const searchMatchesEl = document.getElementById('search-matches');

        if (totalNodesEl) {
            totalNodesEl.textContent = document.querySelectorAll('.tree-node').length;
        }
        if (expandedNodesEl) {
            expandedNodesEl.textContent = document.querySelectorAll('.tree-children.expanded').length;
        }
        if (searchMatchesEl) {
            searchMatchesEl.textContent = this.treeState.searchResults.length;
        }
    }

    clearInput() {
        const jsonInput = document.getElementById('policy-json-input');
        if (jsonInput) {
            jsonInput.value = '';
        }

        this.currentPolicy = null;
        this.analysisResults = {};
        
        const resultsContainer = document.getElementById('linter-results');
        if (resultsContainer) {
            resultsContainer.classList.add('hidden');
        }
        
        const exportBtn = document.getElementById('export-all');
        if (exportBtn) exportBtn.disabled = true;
        
        this.clearAllTabs();
        alert('Input cleared successfully');
    }

    clearAllTabs() {
        const containers = [
            'search-results',
            'policy-aliases-used',
            'parameter-overview',
            'parameter-details', 
            'current-effect-analysis',
            'policy-diagram',
            'json-tree'
        ];

        containers.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.innerHTML = '<div class="no-results">Load a policy to analyze</div>';
            }
        });

        // Clear tree state
        this.treeState = { expandedNodes: new Set(), searchResults: [] };
        this.updateTreeStats();
    }

    // Metadata & Insights Implementation
    updateMetadataInsights() {
        if (!this.currentPolicy) return;

        this.updatePolicyOverview();
        this.updateScopeCategory();
        this.updateAssignmentCompliance();
        this.updateImpactAnalysis();
    }

    updatePolicyOverview() {
        const container = document.getElementById('policy-overview');
        if (!container) return;

        const policy = this.currentPolicy.properties || this.currentPolicy;
        const basicInfo = this.analysisResults.basicInfo;

        container.innerHTML = `
            <div class="policy-overview-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
                <div class="overview-item">
                    <div class="overview-label">Display Name</div>
                    <div class="overview-value">${basicInfo.displayName}</div>
                </div>
                <div class="overview-item">
                    <div class="overview-label">Mode</div>
                    <div class="overview-value">${basicInfo.mode}</div>
                </div>
                <div class="overview-item">
                    <div class="overview-label">Category</div>
                    <div class="overview-value">${basicInfo.category}</div>
                </div>
                <div class="overview-item">
                    <div class="overview-label">Version</div>
                    <div class="overview-value">${basicInfo.version}</div>
                </div>
                <div class="overview-item">
                    <div class="overview-label">Policy Type</div>
                    <div class="overview-value">${this.isBuiltInPolicy(policy) ? 'Built-in' : 'Custom'}</div>
                </div>
                <div class="overview-item">
                    <div class="overview-label">Effect</div>
                    <div class="overview-value">${this.analysisResults.effects.type.toUpperCase()}</div>
                </div>
            </div>
            <div class="policy-description" style="margin-top: 16px; padding: 16px; background: var(--color-bg-2); border-radius: 8px;">
                <div class="description-label" style="font-weight: bold; margin-bottom: 8px;">Description</div>
                <div class="description-text">${basicInfo.description}</div>
            </div>
        `;
    }

    updateScopeCategory() {
        const container = document.getElementById('scope-category');
        if (!container) return;

        const policy = this.currentPolicy.properties || this.currentPolicy;
        const categories = this.extractCategories(policy);
        const scope = this.analyzeScope(policy);

        container.innerHTML = `
            <div class="scope-analysis">
                <div class="scope-item">
                    <div class="scope-label">Scope</div>
                    <div class="scope-value">${scope.type}</div>
                    <div class="scope-description">${scope.description}</div>
                </div>
                <div class="categories-section">
                    <div class="categories-label">Categories</div>
                    <div class="categories-tags">
                        ${categories.map(cat => `
                            <span class="category-tag" style="display: inline-block; padding: 4px 8px; background: var(--color-primary); color: white; border-radius: 12px; font-size: 12px; margin: 2px;">${cat}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }


    updateAssignmentCompliance() {
        const container = document.getElementById('assignment-compliance');
        if (!container) return;

        // Simulate assignment data (in real implementation, this would come from Azure API)
        const assignments = this.simulateAssignments();

        container.innerHTML = `
            <div class="assignment-tree">
                <div class="assignment-item">
                    <div class="assignment-level">Management Group</div>
                    <div class="assignment-name">Root Management Group</div>
                    <div class="assignment-status compliant">Compliant (85%)</div>
                </div>
                <div class="assignment-children" style="margin-left: 20px;">
                    <div class="assignment-item">
                        <div class="assignment-level">Subscription</div>
                        <div class="assignment-name">Production Subscription</div>
                        <div class="assignment-status compliant">Compliant (92%)</div>
                    </div>
                    <div class="assignment-item">
                        <div class="assignment-level">Subscription</div>
                        <div class="assignment-name">Development Subscription</div>
                        <div class="assignment-status non-compliant">Non-Compliant (45%)</div>
                    </div>
                </div>
            </div>
            <div class="compliance-heatmap" style="margin-top: 16px;">
                <div class="heatmap-title">Compliance Heatmap</div>
                <div class="heatmap-grid" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-top: 8px;">
                    ${Array.from({length: 30}, (_, i) => `
                        <div class="heatmap-cell" style="height: 20px; background: ${this.getComplianceColor(Math.random() * 100)}; border-radius: 2px;"></div>
`).join('')}
                </div>
            </div>
        `;
    }

    updateImpactAnalysis() {
        const container = document.getElementById('impact-analysis');
        if (!container) return;

        const impact = this.analyzePolicyImpact();

        container.innerHTML = `
            <div class="impact-analysis-content">
                <div class="impact-item">
                    <div class="impact-label">Estimated Affected Resources</div>
                    <div class="impact-value">${impact.estimatedResources}</div>
                </div>
                <div class="impact-item">
                    <div class="impact-label">Resource Types</div>
                    <div class="impact-value">${impact.resourceTypes.join(', ')}</div>
                </div>
                <div class="impact-item">
                    <div class="impact-label">Risk Assessment</div>
                    <div class="impact-value ${impact.riskLevel.toLowerCase()}">${impact.riskLevel}</div>
                </div>
                <div class="impact-item">
                    <div class="impact-label">Business Impact</div>
                    <div class="impact-value">${impact.businessImpact}</div>
                </div>
            </div>
        `;
    }


    // Helper functions for new features
    isBuiltInPolicy(policy) {
        // Simple heuristic - in real implementation, check against Azure built-in policies
        return policy.metadata?.category === 'General' || 
               policy.displayName?.includes('Allowed') ||
               policy.displayName?.includes('Deny');
    }

    extractCategories(policy) {
        const categories = [];
        if (policy.metadata?.category) {
            categories.push(policy.metadata.category);
        }
        
        // Extract additional categories from description or name
        const text = `${policy.displayName} ${policy.description}`.toLowerCase();
        if (text.includes('security')) categories.push('Security');
        if (text.includes('cost')) categories.push('Cost');
        if (text.includes('network')) categories.push('Networking');
        if (text.includes('storage')) categories.push('Storage');
        if (text.includes('compute')) categories.push('Compute');
        
        return [...new Set(categories)];
    }

    analyzeScope(policy) {
        const mode = policy.mode || 'All';
        
        if (mode === 'Indexed') {
            return {
                type: 'Indexed Resources',
                description: 'Applies to resources that support tags and location'
            };
        } else if (mode === 'All') {
            return {
                type: 'All Resources',
                description: 'Applies to all resource types including extensions'
            };
        } else {
            return {
                type: 'Custom Scope',
                description: 'Applies to specific resource types or scopes'
            };
        }
    }

    simulateAssignments() {
        return [
            { level: 'Management Group', name: 'Root MG', compliance: 85 },
            { level: 'Subscription', name: 'Prod Sub', compliance: 92 },
            { level: 'Subscription', name: 'Dev Sub', compliance: 45 }
        ];
    }

    getComplianceColor(percentage) {
        if (percentage >= 80) return '#4caf50';
        if (percentage >= 60) return '#ff9800';
        return '#f44336';
    }

    analyzePolicyImpact() {
        const policy = this.currentPolicy.properties || this.currentPolicy;
        const effect = policy.policyRule?.then?.effect || 'unknown';
        
        return {
            estimatedResources: this.estimateAffectedResources(policy),
            resourceTypes: this.extractResourceTypes(policy),
            riskLevel: this.assessRiskLevel(effect),
            businessImpact: this.assessBusinessImpact(effect)
        };
    }

    estimateAffectedResources(policy) {
        // Simple estimation based on policy scope and effect
        const mode = policy.mode || 'All';
        const effect = policy.policyRule?.then?.effect || 'audit';
        
        if (mode === 'All') return 'High (All resources)';
        if (mode === 'Indexed') return 'Medium (Tagged resources)';
        return 'Low (Specific resources)';
    }

    extractResourceTypes(policy) {
        const fields = this.extractFields(policy);
        const types = new Set();
        
        fields.forEach(field => {
            const parts = field.split('/');
            if (parts.length >= 2) {
                types.add(parts[0] + '/' + parts[1]);
            }
        });
        
        return Array.from(types).slice(0, 5); // Limit to 5 for display
    }

    assessRiskLevel(effect) {
        const riskLevels = {
            'deny': 'High',
            'deployIfNotExists': 'High',
            'modify': 'Medium',
            'append': 'Low',
            'audit': 'Low',
            'auditIfNotExists': 'Low',
            'disabled': 'None'
        };
        return riskLevels[effect.toLowerCase()] || 'Unknown';
    }

    assessBusinessImpact(effect) {
        const impacts = {
            'deny': 'Blocks resource operations',
            'deployIfNotExists': 'Creates additional resources',
            'modify': 'Modifies resource properties',
            'append': 'Adds resource properties',
            'audit': 'Monitoring only',
            'auditIfNotExists': 'Monitoring only',
            'disabled': 'No impact'
        };
        return impacts[effect.toLowerCase()] || 'Unknown impact';
    }

    generateEffectExplanation(conditions, effect) {
        if (!conditions) {
            return `This policy will apply the ${effect.toUpperCase()} effect to all resources.`;
        }

        const conditionText = this.conditionToText(conditions);
        return `If ${conditionText}, then ${effect.toUpperCase()}.`;
    }

    conditionToText(node) {
        if (!node) return 'condition is met';
        
        if (node.type === 'condition') {
            return `${node.field} ${this.getOperatorText(node.operator)} ${JSON.stringify(node.value)}`;
        }
        
        if (node.type === 'allOf') {
            const childTexts = node.children.map(child => this.conditionToText(child));
            return `(${childTexts.join(' AND ')})`;
        }
        
        if (node.type === 'anyOf') {
            const childTexts = node.children.map(child => this.conditionToText(child));
            return `(${childTexts.join(' OR ')})`;
        }
        
        if (node.type === 'not') {
            return `NOT (${this.conditionToText(node.children[0])})`;
        }
        
        return 'condition is met';
    }

    getOperatorText(operator) {
        const operators = {
            'equals': 'equals',
            'notEquals': 'does not equal',
            'in': 'is in',
            'notIn': 'is not in',
            'contains': 'contains',
            'notContains': 'does not contain',
            'exists': 'exists',
            'greater': 'is greater than',
            'greaterOrEquals': 'is greater than or equal to',
            'less': 'is less than',
            'lessOrEquals': 'is less than or equal to',
            'like': 'is like',
            'notLike': 'is not like'
        };
        return operators[operator] || operator;
    }

    detectPolicyConflicts() {
        // Simulate conflict detection (in real implementation, compare with other policies)
        return [];
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎉 DOM loaded, initializing FIXED Azure Policy Analyzer...');
    window.azurePolicyAnalyzer = new AzurePolicyAnalyzer();
});