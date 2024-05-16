IF NOT EXISTS (SELECT 1 FROM [insiteCommerce].[dbo].[SystemSetting] WHERE [Name] = 'ContactUs_AdminEmailAddress')
BEGIN
    INSERT INTO [insiteCommerce].[dbo].[SystemSetting] ([Name], [WebsiteId], [Value], [CreatedOn], [CreatedBy], [ModifiedOn], [ModifiedBy])
    VALUES ('ContactUsEmail', NULL, 'admin@example.com', GETDATE(), 'admin_admin', GETDATE(), 'admin_admin')
END