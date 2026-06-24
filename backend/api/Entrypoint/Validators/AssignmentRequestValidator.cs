using System;
using FluentValidation;
using Service.Dtos;

namespace Entrypoint.Validators;

public class AssignmentRequestValidator : AbstractValidator<CreateAssignmentRequest>
{
    public AssignmentRequestValidator()
    {
        RuleFor(x => x.VesselId)
            .NotEqual(Guid.Empty).WithMessage("Vessel ID is required and must be a valid GUID.");

        RuleFor(x => x.PositionId)
            .NotEmpty().WithMessage("Position ID is required.")
            .NotEqual(Guid.Empty).WithMessage("Position ID must be a valid GUID.");

        RuleFor(x => x.PrincipalId)
            .NotEmpty().WithMessage("Principal ID is required and must be a valid GUID.");

        RuleFor(x => x.SignOnPort)
            .NotEmpty().WithMessage("Sign-on port is required.")
            .MaximumLength(5).WithMessage("Sign-on port UN/LOCODE must not exceed 5 characters."); 

        RuleFor(x => x.SignOnDate)
            .NotEmpty().WithMessage("Sign-on date is required.");

        RuleFor(x => x.SignOffPort)
            .NotEmpty().WithMessage("Sign-off port is required.")
            .MaximumLength(5).WithMessage("Sign-off port UN/LOCODE must not exceed 5 characters.");

        RuleFor(x => x.SignOffDate)
            .NotEmpty().WithMessage("Sign-off date is required.")
            .GreaterThan(x => x.SignOnDate)
            .WithMessage("Sign-off date must logically occur after the sign-on date.");
    }
}