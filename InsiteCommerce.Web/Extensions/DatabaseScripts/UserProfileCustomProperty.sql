IF NOT EXISTS (
    SELECT 1
    FROM AppDict.EntityConfiguration
    WHERE Name = 'userProfile'
)
BEGIN
    INSERT INTO AppDict.EntityConfiguration (Name, Description, Label, PluralizedLabel, DisplayNameFormat, InstructionalText, CanView, CanEdit, CanCreate, CanDelete)
    VALUES ('userProfile', NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0)
END

IF NOT EXISTS (
    SELECT 1
    FROM AppDict.PropertyConfiguration
    WHERE EntityConfigurationId = (SELECT id FROM AppDict.EntityConfiguration WHERE Name = 'userProfile')
    AND Name = 'userRole'
)
BEGIN
    INSERT INTO AppDict.PropertyConfiguration (EntityConfigurationId, Name, Label, ControlType, PropertyType, IsCustomProperty, CanView, CanEdit)
    SELECT id,'userRole','UserRole', 'NULL', 'NULL', 1, 1, 0 
    FROM AppDict.EntityConfiguration
    WHERE Name = 'userProfile';
END