-- Seed Data for E-Sea System
-- Using variables for easy ID management

DECLARE @UserId UNIQUEIDENTIFIER = '7328967C-C97D-42E0-A8FA-08DEC2DE20CE';

-- Clean up existing data
DELETE FROM [Assignments];
DELETE FROM [Trainings];
DELETE FROM [RecentActivityFeeds];
DELETE FROM [ComplianceAndRequirements];
DELETE FROM [DocumentTypes];
DELETE FROM [News];
DELETE FROM [Vessels];
DELETE FROM [Positions];
DELETE FROM [Users] WHERE [Id] = @UserId;

-- 1. Insert User
INSERT INTO [Users] ([Id], [Email], [Password], [FullName], [ComplianceScore], [CurrentStatus], [NextAssignmentDate], [CreatedAt])
VALUES (@UserId, 'sailor@example.com', '$2a$12$R.S7/l6Gf.mB8fW9xK6D.u8V5zG1T6z6e3S3B9v9W9w9W9w9W9w9W', 'Sailor Sam', 85, 'Active', '2026-07-01', GETDATE());

-- 2. Insert Positions (Realistic maritime roles)
DECLARE @PosCaptain UNIQUEIDENTIFIER = NEWID();
DECLARE @PosChiefOfficer UNIQUEIDENTIFIER = NEWID();
DECLARE @PosSecondOfficer UNIQUEIDENTIFIER = NEWID();
DECLARE @PosThirdOfficer UNIQUEIDENTIFIER = NEWID();
DECLARE @PosChiefEngineer UNIQUEIDENTIFIER = NEWID();
DECLARE @PosSecondEngineer UNIQUEIDENTIFIER = NEWID();
DECLARE @PosThirdEngineer UNIQUEIDENTIFIER = NEWID();
DECLARE @PosETO UNIQUEIDENTIFIER = NEWID();
DECLARE @PosBosun UNIQUEIDENTIFIER = NEWID();
DECLARE @PosAbleSeaman UNIQUEIDENTIFIER = NEWID();
DECLARE @PosCook UNIQUEIDENTIFIER = NEWID();

INSERT INTO [Positions] ([Id], [Title], [CreatedAt]) VALUES
(@PosCaptain, 'Master/Captain', GETDATE()),
(@PosChiefOfficer, 'Chief Officer', GETDATE()),
(@PosSecondOfficer, 'Second Officer', GETDATE()),
(@PosThirdOfficer, 'Third Officer', GETDATE()),
(@PosChiefEngineer, 'Chief Engineer', GETDATE()),
(@PosSecondEngineer, 'Second Engineer', GETDATE()),
(@PosThirdEngineer, 'Third Engineer', GETDATE()),
(@PosETO, 'Electro-Technical Officer', GETDATE()),
(@PosBosun, 'Bosun', GETDATE()),
(@PosAbleSeaman, 'Able Seaman', GETDATE()),
(@PosCook, 'Chief Cook', GETDATE());

-- 3. Insert Vessels (20 Real-world vessels with IMO numbers)
DECLARE @V1 UNIQUEIDENTIFIER = NEWID(); DECLARE @V2 UNIQUEIDENTIFIER = NEWID(); DECLARE @V3 UNIQUEIDENTIFIER = NEWID();
DECLARE @V4 UNIQUEIDENTIFIER = NEWID(); DECLARE @V5 UNIQUEIDENTIFIER = NEWID(); DECLARE @V6 UNIQUEIDENTIFIER = NEWID();
DECLARE @V7 UNIQUEIDENTIFIER = NEWID(); DECLARE @V8 UNIQUEIDENTIFIER = NEWID(); DECLARE @V9 UNIQUEIDENTIFIER = NEWID();
DECLARE @V10 UNIQUEIDENTIFIER = NEWID(); DECLARE @V11 UNIQUEIDENTIFIER = NEWID(); DECLARE @V12 UNIQUEIDENTIFIER = NEWID();
DECLARE @V13 UNIQUEIDENTIFIER = NEWID(); DECLARE @V14 UNIQUEIDENTIFIER = NEWID(); DECLARE @V15 UNIQUEIDENTIFIER = NEWID();
DECLARE @V16 UNIQUEIDENTIFIER = NEWID(); DECLARE @V17 UNIQUEIDENTIFIER = NEWID(); DECLARE @V18 UNIQUEIDENTIFIER = NEWID();
DECLARE @V19 UNIQUEIDENTIFIER = NEWID(); DECLARE @V20 UNIQUEIDENTIFIER = NEWID();

INSERT INTO [Vessels] ([Id], [ImoNumber], [Name], [Type], [CreatedAt]) VALUES
(@V1, '9337626', 'Emma Maersk', 'Container Ship', GETDATE()),
(@V2, '9411135', 'MSC Oscar', 'Container Ship', GETDATE()),
(@V3, '9708851', 'Barzan', 'Container Ship', GETDATE()),
(@V4, '9148790', 'Knock Nevis', 'ULCC', GETDATE()),
(@V5, '9250567', 'Berge Stahl', 'Bulk Carrier', GETDATE()),
(@V6, '9330082', 'Oasis of the Seas', 'Cruise Ship', GETDATE()),
(@V7, '9835719', 'HMM Algeciras', 'Container Ship', GETDATE()),
(@V8, '9419163', 'TI Oceania', 'ULCC', GETDATE()),
(@V9, '9780859', 'CMA CGM Antoine de Saint Exupéry', 'Container Ship', GETDATE()),
(@V10, '9436410', 'Vale Brasil', 'Valemax Bulk Carrier', GETDATE()),
(@V11, '9313400', 'Cosco Guangzhou', 'Container Ship', GETDATE()),
(@V12, '9778844', 'Ever Gentle', 'Container Ship', GETDATE()),
(@V13, '9857183', 'MSC Gulsun', 'Container Ship', GETDATE()),
(@V14, '9448724', 'MOL Triumph', 'Container Ship', GETDATE()),
(@V15, '9708679', 'Madrid Maersk', 'Container Ship', GETDATE()),
(@V16, '9197038', 'Symphony of the Seas', 'Cruise Ship', GETDATE()),
(@V17, '9308510', 'Colombo Express', 'Container Ship', GETDATE()),
(@V18, '9235529', 'Savannah Express', 'Container Ship', GETDATE()),
(@V19, '9321483', 'MSC Daniela', 'Container Ship', GETDATE()),
(@V20, '9334856', 'Gudrun Maersk', 'Container Ship', GETDATE());

-- 4. Insert Document Types
DECLARE @DocPassport UNIQUEIDENTIFIER = NEWID();
DECLARE @DocSeamansBook UNIQUEIDENTIFIER = NEWID();
DECLARE @DocMedical UNIQUEIDENTIFIER = NEWID();
DECLARE @DocSTCW UNIQUEIDENTIFIER = NEWID();
DECLARE @DocFireFighting UNIQUEIDENTIFIER = NEWID();
DECLARE @DocSurvival UNIQUEIDENTIFIER = NEWID();
DECLARE @DocSecurity UNIQUEIDENTIFIER = NEWID();
DECLARE @DocYellowFever UNIQUEIDENTIFIER = NEWID();
DECLARE @DocDrugAlcohol UNIQUEIDENTIFIER = NEWID();
DECLARE @DocCodeOfConduct UNIQUEIDENTIFIER = NEWID();

INSERT INTO [DocumentTypes] ([Id], [Name], [Description], [CreatedAt]) VALUES
(@DocPassport, 'Passport', 'International travel document', GETDATE()),
(@DocSeamansBook, 'Seaman''s Book', 'Continuous Discharge Certificate (CDC)', GETDATE()),
(@DocMedical, 'Medical Fitness Certificate (ENG1)', 'Mandatory medical clearance', GETDATE()),
(@DocSTCW, 'STCW Basic Safety Training', 'Standards of Training, Certification and Watchkeeping', GETDATE()),
(@DocFireFighting, 'Advanced Fire Fighting', 'Advanced maritime fire safety', GETDATE()),
(@DocSurvival, 'Survival Craft and Rescue Boats', 'Proficiency in survival craft', GETDATE()),
(@DocSecurity, 'Security Awareness Training', 'Maritime security training', GETDATE()),
(@DocYellowFever, 'Yellow Fever Vaccination', 'Mandatory vaccination for certain regions', GETDATE()),
(@DocDrugAlcohol, 'Drug & Alcohol Policy Agreement', 'Acknowledgement of company policy', GETDATE()),
(@DocCodeOfConduct, 'Code of Conduct Acknowledgement', 'Acknowledgement of company standards', GETDATE());

-- 5. Insert Assignments (20 rows for the user)
-- Status values: completed | upcoming | currently-onboard
DECLARE @A1 UNIQUEIDENTIFIER = NEWID(); DECLARE @A2 UNIQUEIDENTIFIER = NEWID(); DECLARE @A3 UNIQUEIDENTIFIER = NEWID();
DECLARE @A4 UNIQUEIDENTIFIER = NEWID(); DECLARE @A5 UNIQUEIDENTIFIER = NEWID(); DECLARE @A6 UNIQUEIDENTIFIER = NEWID();
DECLARE @A7 UNIQUEIDENTIFIER = NEWID(); DECLARE @A8 UNIQUEIDENTIFIER = NEWID(); DECLARE @A9 UNIQUEIDENTIFIER = NEWID();
DECLARE @A10 UNIQUEIDENTIFIER = NEWID(); DECLARE @A11 UNIQUEIDENTIFIER = NEWID(); DECLARE @A12 UNIQUEIDENTIFIER = NEWID();
DECLARE @A13 UNIQUEIDENTIFIER = NEWID(); DECLARE @A14 UNIQUEIDENTIFIER = NEWID(); DECLARE @A15 UNIQUEIDENTIFIER = NEWID();
DECLARE @A16 UNIQUEIDENTIFIER = NEWID(); DECLARE @A17 UNIQUEIDENTIFIER = NEWID(); DECLARE @A18 UNIQUEIDENTIFIER = NEWID();
DECLARE @A19 UNIQUEIDENTIFIER = NEWID(); DECLARE @A20 UNIQUEIDENTIFIER = NEWID();

INSERT INTO [Assignments] ([Id], [UserId], [VesselId], [PositionId], [IsPrimaryPosition], [SignOnDate], [SignOffDate], [SignOnPort], [SignOffPort], [Status], [DurationDays], [CreatedAt]) VALUES
(@A1, @UserId, @V1, @PosThirdOfficer, 1, '2020-01-05', '2020-05-10', 'Singapore', 'Rotterdam', 'completed', 126, GETDATE()),
(@A2, @UserId, @V2, @PosThirdOfficer, 1, '2020-07-15', '2020-11-20', 'Rotterdam', 'Busan', 'completed', 128, GETDATE()),
(@A3, @UserId, @V3, @PosSecondOfficer, 1, '2021-02-10', '2021-06-15', 'Busan', 'Shanghai', 'completed', 125, GETDATE()),
(@A4, @UserId, @V4, @PosSecondOfficer, 1, '2021-08-01', '2021-12-05', 'Shanghai', 'Singapore', 'completed', 126, GETDATE()),
(@A5, @UserId, @V5, @PosSecondOfficer, 1, '2022-01-20', '2022-05-25', 'Singapore', 'Jebel Ali', 'completed', 125, GETDATE()),
(@A6, @UserId, @V6, @PosChiefOfficer, 1, '2022-07-10', '2022-11-15', 'Jebel Ali', 'Hong Kong', 'completed', 128, GETDATE()),
(@A7, @UserId, @V7, @PosChiefOfficer, 1, '2023-01-05', '2023-05-10', 'Hong Kong', 'Long Beach', 'completed', 125, GETDATE()),
(@A8, @UserId, @V8, @PosChiefOfficer, 1, '2023-07-01', '2023-11-05', 'Long Beach', 'Antwerp', 'completed', 127, GETDATE()),
(@A9, @UserId, @V9, @PosChiefOfficer, 1, '2024-01-15', '2024-05-20', 'Antwerp', 'Singapore', 'completed', 126, GETDATE()),
(@A10, @UserId, @V10, @PosChiefOfficer, 1, '2024-07-10', '2024-11-15', 'Singapore', 'Port Klang', 'completed', 128, GETDATE()),
(@A11, @UserId, @V11, @PosChiefOfficer, 1, '2025-01-05', '2025-05-10', 'Port Klang', 'Hamburg', 'completed', 125, GETDATE()),
(@A12, @UserId, @V12, @PosChiefOfficer, 1, '2025-07-01', '2025-11-05', 'Hamburg', 'Colombo', 'completed', 127, GETDATE()),
(@A13, @UserId, @V13, @PosCaptain, 1, '2026-01-15', '2026-05-20', 'Colombo', 'Singapore', 'completed', 125, GETDATE()),
(@A14, @UserId, @V14, @PosCaptain, 1, '2026-06-15', '2026-10-20', 'Singapore', 'Yokohama', 'currently-onboard', 127, GETDATE()),
(@A15, @UserId, @V15, @PosCaptain, 1, '2027-01-10', '2027-05-15', 'Yokohama', 'Los Angeles', 'Scheduled', 125, GETDATE()),
(@A16, @UserId, @V16, @PosCaptain, 1, '2027-07-05', '2027-11-10', 'Los Angeles', 'Singapore', 'Action Needed', 128, GETDATE()),
(@A17, @UserId, @V17, @PosCaptain, 1, '2028-01-15', '2028-05-20', 'Singapore', 'Dubai', 'upcoming', 126, GETDATE()),
(@A18, @UserId, @V18, @PosCaptain, 1, '2028-07-10', '2028-11-15', 'Dubai', 'Rotterdam', 'upcoming', 128, GETDATE()),
(@A19, @UserId, @V19, @PosCaptain, 1, '2029-01-05', '2029-05-10', 'Rotterdam', 'Genoa', 'upcoming', 125, GETDATE()),
(@A20, @UserId, @V20, @PosCaptain, 1, '2029-07-01', '2029-11-05', 'Genoa', 'Singapore', 'upcoming', 127, GETDATE());

-- 6. Insert Vessel Requirements
DELETE FROM [VesselRequirements];
INSERT INTO [VesselRequirements] ([VesselId], [DocumentTypeId], [CreatedAt]) VALUES
(@V1, @DocPassport, GETDATE()),
(@V1, @DocSeamansBook, GETDATE()),
(@V1, @DocMedical, GETDATE()),
(@V1, @DocSTCW, GETDATE()),
(@V14, @DocPassport, GETDATE()),
(@V14, @DocSeamansBook, GETDATE()),
(@V14, @DocMedical, GETDATE()),
(@V14, @DocSTCW, GETDATE()),
(@V15, @DocPassport, GETDATE()),
(@V15, @DocSeamansBook, GETDATE()),
(@V15, @DocMedical, GETDATE()),
(@V16, @DocPassport, GETDATE()),
(@V16, @DocSeamansBook, GETDATE()),
(@V16, @DocMedical, GETDATE());

-- 7. News Data
INSERT INTO [News] ([Id], [Category], [Title], [PublishDate], [ReadTimeMinutes], [ThumbnailUrl], [ContentUrl], [CreatedAt]) VALUES
(NEWID(), 'Safety', 'New Safety Regulations for 2026', '2026-01-15', 5, 'https://picsum.photos/seed/news1/400/300', 'https://example.com/news/safety-2026', GETDATE()),
(NEWID(), 'Company', 'Q1 Fleet Performance Report', '2026-03-10', 8, 'https://picsum.photos/seed/news2/400/300', 'https://example.com/news/fleet-q1', GETDATE()),
(NEWID(), 'Industry', 'Global Shipping Trends in 2026', '2026-02-20', 10, 'https://picsum.photos/seed/news3/400/300', 'https://example.com/news/shipping-trends', GETDATE()),
(NEWID(), 'Training', 'Mandatory Cybersecurity Training for All Crew', '2026-04-05', 4, 'https://picsum.photos/seed/news4/400/300', 'https://example.com/news/cybersecurity', GETDATE()),
(NEWID(), 'Sustainability', 'Switching to Green Methanol: Our Progress', '2026-05-12', 12, 'https://picsum.photos/seed/news5/400/300', 'https://example.com/news/green-methanol', GETDATE()),
(NEWID(), 'Safety', 'Lessons Learned from Recent Port Incidents', '2026-05-28', 6, 'https://picsum.photos/seed/news6/400/300', 'https://example.com/news/port-incidents', GETDATE()),
(NEWID(), 'Welfare', 'Mental Health Support Programs for Seafarers', '2026-01-30', 7, 'https://picsum.photos/seed/news7/400/300', 'https://example.com/news/mental-health', GETDATE()),
(NEWID(), 'Innovation', 'AI-Driven Route Optimization Now Live', '2026-04-18', 9, 'https://picsum.photos/seed/news8/400/300', 'https://example.com/news/ai-route', GETDATE()),
(NEWID(), 'Compliance', 'Updated MARPOL Annex VI Requirements', '2026-03-25', 15, 'https://picsum.photos/seed/news9/400/300', 'https://example.com/news/marpol-update', GETDATE()),
(NEWID(), 'Company', 'New Vessel Addition: The MV Blue Horizon', '2026-05-02', 4, 'https://picsum.photos/seed/news10/400/300', 'https://example.com/news/new-vessel', GETDATE());

-- 8. ComplianceAndRequirements Data
INSERT INTO [ComplianceAndRequirements] ([Id], [DocumentName], [Status], [ExpiryDate], [IsRequired], [UserId], [DocumentTypeId], [CreatedAt]) VALUES
(NEWID(), 'Passport', 'Valid', '2030-05-20', 1, @UserId, @DocPassport, GETDATE()),
(NEWID(), 'Seaman''s Book', 'Valid', '2028-11-15', 1, @UserId, @DocSeamansBook, GETDATE()),
(NEWID(), 'Medical Fitness Certificate (ENG1)', 'Expiring Soon', '2026-07-15', 1, @UserId, @DocMedical, GETDATE()),
(NEWID(), 'STCW Basic Safety Training', 'Valid', '2029-01-10', 1, @UserId, @DocSTCW, GETDATE()),
(NEWID(), 'Advanced Fire Fighting', 'Valid', '2028-03-25', 1, @UserId, @DocFireFighting, GETDATE()),
(NEWID(), 'Survival Craft and Rescue Boats', 'Valid', '2029-06-05', 1, @UserId, @DocSurvival, GETDATE()),
(NEWID(), 'Security Awareness Training', 'Valid', NULL, 1, @UserId, @DocSecurity, GETDATE()),
(NEWID(), 'Yellow Fever Vaccination', 'Valid', '2035-12-31', 0, @UserId, @DocYellowFever, GETDATE()),
(NEWID(), 'Drug & Alcohol Policy Agreement', 'Valid', NULL, 1, @UserId, @DocDrugAlcohol, GETDATE()),
(NEWID(), 'Code of Conduct Acknowledgement', 'Valid', NULL, 1, @UserId, @DocCodeOfConduct, GETDATE());

-- 9. RecentActivityFeeds Data
INSERT INTO [RecentActivityFeeds] ([Id], [ActivityType], [Title], [Description], [UserId], [CreatedAt]) VALUES
(NEWID(), 'Login', 'System Login', 'User logged into the portal from Singapore Office IP', @UserId, DATEADD(hour, -2, GETDATE())),
(NEWID(), 'Document', 'Passport Updated', 'User uploaded a new scan of their passport', @UserId, DATEADD(day, -1, GETDATE())),
(NEWID(), 'Training', 'Training Completed', 'Seafarer completed the Mandatory Cybersecurity course', @UserId, DATEADD(day, -3, GETDATE())),
(NEWID(), 'Profile', 'Address Changed', 'User updated their home address in the profile section', @UserId, DATEADD(day, -5, GETDATE())),
(NEWID(), 'Notification', 'Vessel Assignment', 'New assignment to MV Blue Horizon confirmed', @UserId, DATEADD(day, -7, GETDATE()));

-- 10. Trainings Data
INSERT INTO [Trainings] ([Id], [Title], [ProviderOrLocation], [Status], [ScheduleDate], [UserId], [CreatedAt]) VALUES
(NEWID(), 'Mandatory Cybersecurity Training', 'E-Learning Portal', 'Completed', DATEADD(day, -3, GETDATE()), @UserId, GETDATE()),
(NEWID(), 'Advanced Navigation Radar', 'Maritime Academy Singapore', 'Scheduled', '2026-07-20 09:00:00', @UserId, GETDATE()),
(NEWID(), 'Bridge Resource Management', 'SimTech Center', 'Pending', '2026-08-15 08:30:00', @UserId, GETDATE()),
(NEWID(), 'Engine Room Resource Management', 'SimTech Center', 'Scheduled', '2026-09-05 13:00:00', @UserId, GETDATE()),
(NEWID(), 'First Aid at Sea - Refresher', 'Red Cross Training Hub', 'Completed', DATEADD(month, -2, GETDATE()), @UserId, GETDATE());
