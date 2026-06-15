namespace Domain.Entities;

public class Vessles : Base
{
    public Guid Id { get; private set; }
    public string ImoNumber { get; private set; }
    public string Name { get; private set; }
    public string Type { get; private set; }
    public ICollection<VesselRequirement> VesselRequirements { get; private set; } = [];
}