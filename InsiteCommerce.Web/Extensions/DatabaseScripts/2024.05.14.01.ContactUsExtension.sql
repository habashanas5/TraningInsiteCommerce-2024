IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'Extensions' AND TABLE_NAME = 'ContactUsExtension')
BEGIN
 CREATE TABLE [Extensions].[ContactUsExtension](
         [Id] [uniqueidentifier] NOT NULL CONSTRAINT [DF_ContactUs_Id]  DEFAULT (newsequentialid()),
         [Subject] [nvarchar](100) NOT NULL,
         [FirstName] [nvarchar](50) NOT NULL,
         [LastName] [nvarchar](50) NOT NULL,
         [Email] [nvarchar](100) NOT NULL,
         [Phone] [nvarchar](20) NOT NULL,
         [Address] [nvarchar](200) NOT NULL,
         [Message] [nvarchar](200) NOT NULL,
         [Country] [nvarchar](100) NOT NULL,
         [ZipCode] [nvarchar](20) NOT NULL,
         [CreatedOn] [datetimeoffset](7) NOT NULL CONSTRAINT [DF_ContactUs_CreatedOn]  DEFAULT (getutcdate()),
         [CreatedBy] [nvarchar](100) NOT NULL CONSTRAINT [DF_ContactUs_CreatedBy]  DEFAULT (''),
         [ModifiedOn] [datetimeoffset](7) NOT NULL CONSTRAINT [DF_ContactUs_ModifiedOn]  DEFAULT (getutcdate()),
         [ModifiedBy] [nvarchar](100) NOT NULL CONSTRAINT [DF_ContactUs_ModifiedBy]  DEFAULT (''),
         CONSTRAINT [PK_ContactUs] PRIMARY KEY CLUSTERED
          (
        [Id] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
    ) ON [PRIMARY]     SET ANSI_PADDING ON
END;

