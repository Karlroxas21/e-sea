-- Seed Data for Elena Engine (Chief Engineer)
-- User ID should be filled by the user
DECLARE @UserId UNIQUEIDENTIFIER = '201596A5-900D-4AF3-2EDA-08DECC1A6396'; -- INSERT USER ID HERE

IF @UserId IS NOT NULL
BEGIN
    -- Helper variables for IDs
    DECLARE @PosThirdEngineer UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [Positions] WHERE [Title] = 'Third Engineer');
    DECLARE @PosSecondEngineer UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [Positions] WHERE [Title] = 'Second Engineer');
    DECLARE @PosChiefEngineer UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [Positions] WHERE [Title] = 'Chief Engineer');

    DECLARE @V4 UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [Vessels] WHERE [Name] = 'Knock Nevis');
    DECLARE @V5 UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [Vessels] WHERE [Name] = 'Berge Stahl');
    DECLARE @V8 UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [Vessels] WHERE [Name] = 'TI Oceania');
    DECLARE @V10 UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [Vessels] WHERE [Name] = 'Vale Brasil');

    DECLARE @DocPassport UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [DocumentTypes] WHERE [Name] = 'Passport');
    DECLARE @DocSeamansBook UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [DocumentTypes] WHERE [Name] = 'Seaman''s Book');
    DECLARE @DocMedical UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [DocumentTypes] WHERE [Name] = 'Medical Fitness Certificate (ENG1)');
    DECLARE @DocSTCW UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [DocumentTypes] WHERE [Name] = 'STCW Basic Safety Training');
    DECLARE @DocSecurity UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [DocumentTypes] WHERE [Name] = 'Security Awareness Training');

    -- 2. Insert Assignments (Focus on Engineering roles)
    INSERT INTO [Assignments] ([Id], [UserId], [VesselId], [PositionId], [IsPrimaryPosition], [SignOnDate], [SignOffDate], [SignOnPort], [SignOffPort], [Status], [Warning], [DurationDays], [CreatedAt]) VALUES
    (NEWID(), @UserId, @V4, @PosThirdEngineer, 1, '2021-03-01', '2021-07-15', 'Dubai', 'Singapore', 'completed', NULL, 136, GETDATE()),
    (NEWID(), @UserId, @V5, @PosSecondEngineer, 1, '2022-01-10', '2022-06-20', 'Rotterdam', 'Hedland', 'completed', NULL, 161, GETDATE()),
    (NEWID(), @UserId, @V8, @PosSecondEngineer, 1, '2023-02-15', '2023-08-01', 'Singapore', 'Fujairah', 'completed', NULL, 167, GETDATE()),
    (NEWID(), @UserId, @V10, @PosChiefEngineer, 1, '2024-04-01', '2024-10-10', 'Sao Luis', 'Qingdao', 'completed', NULL, 192, GETDATE()),
    (NEWID(), @UserId, @V5, @PosChiefEngineer, 1, '2025-05-15', '2025-11-20', 'Rotterdam', 'Tubarao', 'completed', NULL, 189, GETDATE()),
    (NEWID(), @UserId, @V8, @PosChiefEngineer, 1, '2026-08-15', '2027-02-10', 'Singapore', 'Dubai', 'upcoming', 'Scheduled', 179, GETDATE());

    -- 3. ComplianceAndRequirements Data (High compliance)
    INSERT INTO [ComplianceAndRequirements] ([Id], [DocumentName], [Status], [ExpiryDate], [IsRequired], [UserId], [DocumentTypeId], [CreatedAt]) VALUES
    (NEWID(), 'Passport', 'Valid', '2030-05-20', 1, @UserId, @DocPassport, GETDATE()),
    (NEWID(), 'Seaman''s Book', 'Valid', '2032-11-15', 1, @UserId, @DocSeamansBook, GETDATE()),
    (NEWID(), 'Medical Fitness Certificate (ENG1)', 'Valid', '2027-01-15', 1, @UserId, @DocMedical, GETDATE()),
    (NEWID(), 'STCW Basic Safety Training', 'Valid', '2031-01-10', 1, @UserId, @DocSTCW, GETDATE()),
    (NEWID(), 'Security Awareness Training', 'Valid', NULL, 1, @UserId, @DocSecurity, GETDATE());

    -- 4. RecentActivityFeeds Data
    INSERT INTO [RecentActivityFeeds] ([Id], [ActivityType], [Title], [Description], [UserId], [CreatedAt]) VALUES
    (NEWID(), 'Training', 'ERM Completed', 'Elena completed the Engine Room Resource Management course with distinction', @UserId, DATEADD(day, -2, GETDATE())),
    (NEWID(), 'Document', 'Medical Renewed', 'Medical certificate ENG1 has been verified and updated', @UserId, DATEADD(day, -10, GETDATE())),
    (NEWID(), 'Assignment', 'Contract Signed', 'Elena signed the contract for the upcoming assignment on TI Oceania', @UserId, DATEADD(day, -15, GETDATE()));

    -- 5. Trainings Data
    INSERT INTO [Trainings] ([Id], [Title], [ProviderOrLocation], [Status], [ScheduleDate], [UserId], [CreatedAt]) VALUES
    (NEWID(), 'Engine Room Resource Management', 'SimTech Center', 'Completed', DATEADD(day, -2, GETDATE()), @UserId, GETDATE()),
    (NEWID(), 'High Voltage Safety Training', 'Maritime Academy', 'Scheduled', '2026-07-10 10:00:00', @UserId, GETDATE()),
    (NEWID(), 'Advanced Steam Turbine Operations', 'Global Engineering Hub', 'Pending', '2026-09-20 09:00:00', @UserId, GETDATE());
END
ELSE
BEGIN
    PRINT 'Please set the @UserId variable at the top of the script.';
END
