-- Seed Data for Sailor Sam (Deck Officer)
-- User ID should be filled by the user
DECLARE @UserId UNIQUEIDENTIFIER = '21D5A8F1-E2E1-45FF-2EDC-08DECC1A6396'; -- INSERT USER ID HERE

IF @UserId IS NOT NULL
BEGIN

    -- Helper variables for IDs
    DECLARE @PosThirdOfficer UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [Positions] WHERE [Title] = 'Third Officer');
    DECLARE @PosSecondOfficer UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [Positions] WHERE [Title] = 'Second Officer');
    DECLARE @PosChiefOfficer UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [Positions] WHERE [Title] = 'Chief Officer');
    DECLARE @PosCaptain UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [Positions] WHERE [Title] = 'Master/Captain');

    DECLARE @V1 UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [Vessels] WHERE [Name] = 'Emma Maersk');
    DECLARE @V2 UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [Vessels] WHERE [Name] = 'MSC Oscar');
    DECLARE @V3 UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [Vessels] WHERE [Name] = 'Barzan');
    DECLARE @V4 UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [Vessels] WHERE [Name] = 'Knock Nevis');
    DECLARE @V5 UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [Vessels] WHERE [Name] = 'Berge Stahl');
    DECLARE @V6 UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [Vessels] WHERE [Name] = 'Oasis of the Seas');
    DECLARE @V7 UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [Vessels] WHERE [Name] = 'HMM Algeciras');
    DECLARE @V8 UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [Vessels] WHERE [Name] = 'TI Oceania');
    DECLARE @V9 UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [Vessels] WHERE [Name] = 'CMA CGM Antoine de Saint Exupéry');
    DECLARE @V10 UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [Vessels] WHERE [Name] = 'Vale Brasil');
    DECLARE @V11 UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [Vessels] WHERE [Name] = 'Cosco Guangzhou');
    DECLARE @V12 UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [Vessels] WHERE [Name] = 'Ever Gentle');
    DECLARE @V13 UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [Vessels] WHERE [Name] = 'MSC Gulsun');
    DECLARE @V14 UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [Vessels] WHERE [Name] = 'MOL Triumph');
    DECLARE @V15 UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [Vessels] WHERE [Name] = 'Madrid Maersk');
    DECLARE @V18 UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [Vessels] WHERE [Name] = 'Savannah Express');
    DECLARE @V19 UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [Vessels] WHERE [Name] = 'MSC Daniela');
    DECLARE @V20 UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [Vessels] WHERE [Name] = 'Gudrun Maersk');

    DECLARE @DocPassport UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [DocumentTypes] WHERE [Name] = 'Passport');
    DECLARE @DocSeamansBook UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [DocumentTypes] WHERE [Name] = 'Seaman''s Book');
    DECLARE @DocMedical UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [DocumentTypes] WHERE [Name] = 'Medical Fitness Certificate (ENG1)');
    DECLARE @DocSTCW UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [DocumentTypes] WHERE [Name] = 'STCW Basic Safety Training');
    DECLARE @DocFireFighting UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [DocumentTypes] WHERE [Name] = 'Advanced Fire Fighting');
    DECLARE @DocSurvival UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [DocumentTypes] WHERE [Name] = 'Survival Craft and Rescue Boats');
    DECLARE @DocSecurity UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [DocumentTypes] WHERE [Name] = 'Security Awareness Training');
    DECLARE @DocYellowFever UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [DocumentTypes] WHERE [Name] = 'Yellow Fever Vaccination');
    DECLARE @DocDrugAlcohol UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [DocumentTypes] WHERE [Name] = 'Drug & Alcohol Policy Agreement');
    DECLARE @DocCodeOfConduct UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM [DocumentTypes] WHERE [Name] = 'Code of Conduct Acknowledgement');

    -- 2. Insert Assignments
    INSERT INTO [Assignments] ([Id], [UserId], [VesselId], [PositionId], [IsPrimaryPosition], [SignOnDate], [SignOffDate], [SignOnPort], [SignOffPort], [Status], [Warning], [DurationDays], [CreatedAt]) VALUES
    (NEWID(), @UserId, @V1, @PosThirdOfficer, 1, '2020-01-05', '2020-05-10', 'Singapore', 'Rotterdam', 'completed', NULL, 126, GETDATE()),
    (NEWID(), @UserId, @V2, @PosThirdOfficer, 1, '2020-07-15', '2020-11-20', 'Rotterdam', 'Busan', 'completed', NULL, 128, GETDATE()),
    (NEWID(), @UserId, @V3, @PosSecondOfficer, 1, '2021-02-10', '2021-06-15', 'Busan', 'Shanghai', 'completed', NULL, 125, GETDATE()),
    (NEWID(), @UserId, @V4, @PosSecondOfficer, 1, '2021-08-01', '2021-12-05', 'Shanghai', 'Singapore', 'completed', NULL, 126, GETDATE()),
    (NEWID(), @UserId, @V5, @PosSecondOfficer, 1, '2022-01-20', '2022-05-25', 'Singapore', 'Jebel Ali', 'completed', NULL, 125, GETDATE()),
    (NEWID(), @UserId, @V6, @PosChiefOfficer, 1, '2022-07-10', '2022-11-15', 'Jebel Ali', 'Hong Kong', 'completed', NULL, 128, GETDATE()),
    (NEWID(), @UserId, @V7, @PosChiefOfficer, 1, '2023-01-05', '2023-05-10', 'Hong Kong', 'Long Beach', 'completed', NULL, 125, GETDATE()),
    (NEWID(), @UserId, @V8, @PosChiefOfficer, 1, '2023-07-01', '2023-11-05', 'Long Beach', 'Antwerp', 'completed', NULL, 127, GETDATE()),
    (NEWID(), @UserId, @V9, @PosChiefOfficer, 1, '2024-01-15', '2024-05-20', 'Antwerp', 'Singapore', 'completed', NULL, 126, GETDATE()),
    (NEWID(), @UserId, @V10, @PosChiefOfficer, 1, '2024-07-10', '2024-11-15', 'Singapore', 'Port Klang', 'completed', NULL, 128, GETDATE()),
    (NEWID(), @UserId, @V11, @PosChiefOfficer, 1, '2025-01-05', '2025-05-10', 'Port Klang', 'Hamburg', 'completed', NULL, 125, GETDATE()),
    (NEWID(), @UserId, @V12, @PosChiefOfficer, 1, '2025-07-01', '2025-11-05', 'Hamburg', 'Colombo', 'completed', NULL, 127, GETDATE()),
    (NEWID(), @UserId, @V13, @PosCaptain, 1, '2026-01-15', '2026-05-20', 'Colombo', 'Singapore', 'completed', NULL, 125, GETDATE()),
    (NEWID(), @UserId, @V14, @PosCaptain, 1, '2026-06-15', '2026-10-20', 'Singapore', 'Yokohama', 'currently-onboard', NULL, 127, GETDATE()),
    (NEWID(), @UserId, @V15, @PosCaptain, 1, '2027-01-10', '2027-05-15', 'Yokohama', 'Los Angeles', 'upcoming', 'Scheduled', 125, GETDATE()),
    (NEWID(), @UserId, @V1, @PosCaptain, 1, '2027-07-05', '2027-11-10', 'Los Angeles', 'Singapore', 'upcoming', 'Action Needed', 128, GETDATE()),
    (NEWID(), @UserId, @V1, @PosCaptain, 1, '2028-01-15', '2028-05-20', 'Singapore', 'Dubai', 'upcoming', NULL, 126, GETDATE()),
    (NEWID(), @UserId, @V18, @PosCaptain, 1, '2028-07-10', '2028-11-15', 'Dubai', 'Rotterdam', 'upcoming', 'Scheduled', 128, GETDATE()),
    (NEWID(), @UserId, @V19, @PosCaptain, 1, '2029-01-05', '2029-05-10', 'Rotterdam', 'Genoa', 'upcoming', 'Scheduled', 125, GETDATE()),
    (NEWID(), @UserId, @V20, @PosCaptain, 1, '2029-07-01', '2029-11-05', 'Genoa', 'Singapore', 'upcoming', 'Scheduled', 127, GETDATE());

    -- 3. ComplianceAndRequirements Data
    INSERT INTO [ComplianceAndRequirements] ([Id], [DocumentName], [Status], [ExpiryDate], [IsRequired], [UserId], [DocumentTypeId], [CreatedAt]) VALUES
    (NEWID(), 'Passport', 'Expired', '2020-01-01', 1, @UserId, @DocPassport, GETDATE()),
    (NEWID(), 'Seaman''s Book', 'Valid', '2028-11-15', 1, @UserId, @DocSeamansBook, GETDATE()),
    (NEWID(), 'Medical Fitness Certificate (ENG1)', 'Expiring Soon', '2026-07-15', 1, @UserId, @DocMedical, GETDATE()),
    (NEWID(), 'STCW Basic Safety Training', 'Valid', '2029-01-10', 1, @UserId, @DocSTCW, GETDATE()),
    (NEWID(), 'Advanced Fire Fighting', 'Valid', '2028-03-25', 1, @UserId, @DocFireFighting, GETDATE()),
    (NEWID(), 'Survival Craft and Rescue Boats', 'Valid', '2029-06-05', 1, @UserId, @DocSurvival, GETDATE()),
    (NEWID(), 'Security Awareness Training', 'Valid', NULL, 1, @UserId, @DocSecurity, GETDATE()),
    (NEWID(), 'Yellow Fever Vaccination', 'Valid', '2035-12-31', 0, @UserId, @DocYellowFever, GETDATE()),
    (NEWID(), 'Drug & Alcohol Policy Agreement', 'Valid', NULL, 1, @UserId, @DocDrugAlcohol, GETDATE()),
    (NEWID(), 'Code of Conduct Acknowledgement', 'Valid', NULL, 1, @UserId, @DocCodeOfConduct, GETDATE());

    -- 4. RecentActivityFeeds Data
    INSERT INTO [RecentActivityFeeds] ([Id], [ActivityType], [Title], [Description], [UserId], [CreatedAt]) VALUES
    (NEWID(), 'Login', 'System Login', 'User logged into the portal from Singapore Office IP', @UserId, DATEADD(hour, -2, GETDATE())),
    (NEWID(), 'Document', 'Passport Updated', 'User uploaded a new scan of their passport', @UserId, DATEADD(day, -1, GETDATE())),
    (NEWID(), 'Training', 'Training Completed', 'Seafarer completed the Mandatory Cybersecurity course', @UserId, DATEADD(day, -3, GETDATE())),
    (NEWID(), 'Profile', 'Address Changed', 'User updated their home address in the profile section', @UserId, DATEADD(day, -5, GETDATE())),
    (NEWID(), 'Notification', 'Vessel Assignment', 'New assignment to MV Blue Horizon confirmed', @UserId, DATEADD(day, -7, GETDATE()));

    -- 5. Trainings Data
    INSERT INTO [Trainings] ([Id], [Title], [ProviderOrLocation], [Status], [ScheduleDate], [UserId], [CreatedAt]) VALUES
    (NEWID(), 'Mandatory Cybersecurity Training', 'E-Learning Portal', 'Completed', DATEADD(day, -3, GETDATE()), @UserId, GETDATE()),
    (NEWID(), 'Advanced Navigation Radar', 'Maritime Academy Singapore', 'Scheduled', '2026-07-20 09:00:00', @UserId, GETDATE()),
    (NEWID(), 'Bridge Resource Management', 'SimTech Center', 'Pending', '2026-08-15 08:30:00', @UserId, GETDATE()),
    (NEWID(), 'Engine Room Resource Management', 'SimTech Center', 'Scheduled', '2026-09-05 13:00:00', @UserId, GETDATE()),
    (NEWID(), 'First Aid at Sea - Refresher', 'Red Cross Training Hub', 'Completed', DATEADD(month, -2, GETDATE()), @UserId, GETDATE());
END
ELSE
BEGIN
    PRINT 'Please set the @UserId variable at the top of the script.';
END
