using FluentValidation;
using Service.Dtos;

namespace Entrypoint.Validators;

public class UserRegisterValidator : AbstractValidator<UserRegister>
{
    public UserRegisterValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("A valid email address is required.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required.")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters long.");
    }
}