using FluentValidation;
using Service.Dtos;

namespace Entrypoint.Validators;

public class BroadcastRequestValidator : AbstractValidator<BroadcastRequest>
{
    public BroadcastRequestValidator()
    {
        RuleFor(x => x.RecipientIds)
            .NotEmpty().WithMessage("At least one recipient ID is required.")
            .Must(ids => ids != null && ids.All(id => id != Guid.Empty))
            .WithMessage("Recipient IDs must contain valid (non-empty) GUIDs.");

        RuleFor(x => x.Content)
            .NotEmpty().WithMessage("Broadcast notification content is required.")
            .MaximumLength(1000).WithMessage("Broadcast notification content must not exceed 1000 characters.");
    }
}
