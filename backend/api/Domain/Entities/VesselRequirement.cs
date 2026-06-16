namespace Domain.Entities;

public class VesselRequirement : Base
{
    public Guid VesselId { get; private set; }
    public Vessles Vessel { get; private set; }
    public Guid DocumentTypeId { get; private set; }
    public DocumentType DocumentType { get; private set; }

    public static VesselRequirement Create(Guid vesselId, Guid documentTypeId)
    {
        return new VesselRequirement
        {
            VesselId = vesselId,
            DocumentTypeId = documentTypeId,
            CreatedAt = DateTime.UtcNow
        };
    }
}