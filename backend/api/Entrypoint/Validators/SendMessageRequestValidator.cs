using FluentValidation;
using Service.Dtos;

namespace Entrypoint.Validators;

public class SendMessageRequestValidator : AbstractValidator<SendMessageRequest>
{
    public SendMessageRequestValidator()
    {
        RuleFor(x => x.RecipientId)
            .NotEmpty().WithMessage("Recipient ID is required and cannot be empty.");

        RuleFor(x => x.Content)
            .NotEmpty().WithMessage("Message content is required.")
            .MaximumLength(2000).WithMessage("Message content must not exceed 2000 characters.");
    }
}