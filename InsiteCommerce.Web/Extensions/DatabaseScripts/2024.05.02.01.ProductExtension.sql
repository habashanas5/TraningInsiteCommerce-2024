IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Extensions' AND TABLE_NAME = 'ProductExtension')
BEGIN
    CREATE TABLE [Extensions].[ProductExtension](
        [Id] [uniqueidentifier] NOT NULL CONSTRAINT [DF_ProductExtension_Id]  DEFAULT (newsequentialid()),
        [ERPNumber] [nvarchar](50) NOT NULL,
        [AltNumber] [nvarchar](50) NOT NULL CONSTRAINT [DF_ProductExtension_AltNumber]  DEFAULT (''),
        [Description2] [nvarchar](50) NOT NULL CONSTRAINT [DF_ProductExtension_Description2]  DEFAULT (''),
        [IsSpecialProduct] [bit] NOT NULL CONSTRAINT [DF_ProductExtension_IsSpecialProduct]  DEFAULT (0),
        [HasExtraFeesMessage] [bit] NOT NULL CONSTRAINT [DF_ProductExtension_HasExtraFeesMessage]  DEFAULT (0),
        [CreatedOn] [datetimeoffset](7) NOT NULL CONSTRAINT [DF_ProductExtension_CreatedOn]  DEFAULT (getutcdate()),
        [CreatedBy] [nvarchar](100) NOT NULL CONSTRAINT [DF_ProductExtension_CreatedBy]  DEFAULT (''),
        [ModifiedOn] [datetimeoffset](7) NOT NULL CONSTRAINT [DF_ProductExtension_ModifiedOn]  DEFAULT (getutcdate()),
        [ModifiedBy] [nvarchar](100) NOT NULL CONSTRAINT [DF_ProductExtension_ModifiedBy]  DEFAULT (''),
        CONSTRAINT [PK_ProductExtension] PRIMARY KEY CLUSTERED
    (
        [Id] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    ) ON [PRIMARY]     SET ANSI_PADDING ON

    SET ANSI_PADDING ON
    CREATE UNIQUE NONCLUSTERED INDEX [IX_ProductExtension_ERPNumber] ON [Extensions].[ProductExtension]
    (
        [ERPNumber] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
END;