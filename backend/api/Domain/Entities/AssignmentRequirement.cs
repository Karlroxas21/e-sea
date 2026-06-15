namespace Domain.Entities;

public class AssignmentRequirement : Base
{
    public Guid AssignmentId { get; private set; }
    public Assignments Assignment { get; private set; }
    public Guid DocumentTypeId { get; private set; }
    public DocumentType DocumentType { get; private set; }

    public static AssignmentRequirement Create(Guid assignmentId, Guid documentTypeId)
    {
        return new AssignmentRequirement
        {
            AssignmentId = assignmentId,
            DocumentTypeId = documentTypeId,
            CreatedAt = DateTime.UtcNow
        };
    }
}