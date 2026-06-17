-- Seed Data for Marcus Mess (Chief Cook)
-- User ID should be filled by the user
DECLARE @UserId UNIQUEIDENTIFIER = '90800EF0-8B07-417D-2EDB-08DECC1A6396'; -- INSERT USER ID HERE

IF @UserId IS NOT NULL
BEGIN

    -- Helper variables for IDs
    DECLARE @PosCook UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [Positions] WHERE [Title] = 'Chief Cook');

    DECLARE @V6 UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [Vessels] WHERE [Name] = 'Oasis of the Seas');
    DECLARE @V16 UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [Vessels] WHERE [Name] = 'Symphony of the Seas');

    DECLARE @DocPassport UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [DocumentTypes] WHERE [Name] = 'Passport');
    DECLARE @DocSeamansBook UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [DocumentTypes] WHERE [Name] = 'Seaman''s Book');
    DECLARE @DocMedical UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [DocumentTypes] WHERE [Name] = 'Medical Fitness Certificate (ENG1)');
    DECLARE @DocSTCW UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [DocumentTypes] WHERE [Name] = 'STCW Basic Safety Training');
    DECLARE @DocYellowFever UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [DocumentTypes] WHERE [Name] = 'Yellow Fever Vaccination');

    -- 2. Insert Assignments (Focus on Cruise Ships)
    INSERT INTO [Assignments] ([Id], [UserId], [VesselId], [PositionId], [IsPrimaryPosition], [SignOnDate], [SignOffDate], [SignOnPort], [SignOffPort], [Status], [Warning], [DurationDays], [CreatedAt]) VALUES
    (NEWID(), @UserId, @V6, @PosCook, 1, '2022-05-01', '2022-09-15', 'Miami', 'Nassau', 'completed', NULL, 137, GETDATE()),
    (NEWID(), @UserId, @V16, @PosCook, 1, '2023-01-10', '2023-06-20', 'Barcelona', 'Rome', 'completed', NULL, 161, GETDATE()),
    (NEWID(), @UserId, @V6, @PosCook, 1, '2024-02-15', '2024-08-01', 'Miami', 'St. Maarten', 'completed', NULL, 168, GETDATE()),
    (NEWID(), @UserId, @V16, @PosCook, 1, '2025-03-01', '2025-08-10', 'Southampton', 'Le Havre', 'completed', NULL, 162, GETDATE()),
    (NEWID(), @UserId, @V6, @PosCook, 1, '2026-06-30', '2026-12-15', 'Port Canaveral', 'Cozumel', 'upcoming', 'Action Needed', 168, GETDATE());

    -- 3. ComplianceAndRequirements Data (Some issues for visualization)
    INSERT INTO [ComplianceAndRequirements] ([Id], [DocumentName], [Status], [ExpiryDate], [IsRequired], [UserId], [DocumentTypeId], [CreatedAt]) VALUES
    (NEWID(), 'Passport', 'Valid', '2028-09-10', 1, @UserId, @DocPassport, GETDATE()),
    (NEWID(), 'Seaman''s Book', 'Valid', '2030-01-15', 1, @UserId, @DocSeamansBook, GETDATE()),
    (NEWID(), 'Medical Fitness Certificate (ENG1)', 'Expiring Soon', '2026-07-05', 1, @UserId, @DocMedical, GETDATE()),
    (NEWID(), 'STCW Basic Safety Training', 'Valid', '2031-03-20', 1, @UserId, @DocSTCW, GETDATE()),
    (NEWID(), 'Yellow Fever Vaccination', 'Expired', '2026-01-01', 1, @UserId, @DocYellowFever, GETDATE());

    -- 4. RecentActivityFeeds Data
    INSERT INTO [RecentActivityFeeds] ([Id], [ActivityType], [Title], [Description], [UserId], [CreatedAt]) VALUES
    (NEWID(), 'Alert', 'Document Expired', 'Yellow Fever Vaccination certificate has expired', @UserId, DATEADD(day, -1, GETDATE())),
    (NEWID(), 'Profile', 'Health Form', 'Marcus submitted the pre-embarkation health declaration', @UserId, DATEADD(day, -5, GETDATE())),
    (NEWID(), 'Login', 'Login from Mobile', 'User logged in via the mobile application', @UserId, DATEADD(hour, -5, GETDATE()));

    -- 5. Trainings Data
    INSERT INTO [Trainings] ([Id], [Title], [ProviderOrLocation], [Status], [ScheduleDate], [UserId], [CreatedAt]) VALUES
    (NEWID(), 'Food Safety Level 3', 'Culinary Institute', 'Completed', DATEADD(month, -3, GETDATE()), @UserId, GETDATE()),
    (NEWID(), 'International Cuisine Workshop', 'Global Chef Academy', 'Scheduled', '2026-08-10 14:00:00', @UserId, GETDATE()),
    (NEWID(), 'Maritime Health & Hygiene', 'Health Authority', 'Pending', '2026-07-15 09:00:00', @UserId, GETDATE());
END
ELSE
BEGIN
    PRINT 'Please set the @UserId variable at the top of the script.';
END
