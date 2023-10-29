import { z } from "zod";
import { base64URLStringSchema } from "./helpers";
import { Evaluate } from "../../types";
import {
	COSEAlgorithmIdentifierSchema,
	attestationConveyancePreferenceSchema,
	attestationFormatSchema,
	authenticatorAttachmentSchema,
	authenticatorTransportFutureSchema,
	publicKeyCredentialHintsSchema,
	publicKeyCredentialTypeSchema,
	residentKeyRequirementSchema,
	userVerificationRequirementSchema,
} from "./enums";
import { authenticationExtensionsClientInputsSchema } from "./extensions";

export const publicKeyCredentialEntitySchema = z.object({ name: z.string() });

export const publicKeyCredentialRpEntitySchema = z
	.object({
		id: z.string().optional(),
	})
	.merge(publicKeyCredentialEntitySchema);

export const publicKeyCredentialUserEntitySchema = z.object({
	id: base64URLStringSchema,
	name: z.string(),
	displayName: z.string(),
});

export const publicKeyCredentialParametersSchema = z.object({
	type: z.string(),
	alg: COSEAlgorithmIdentifierSchema,
});

export const publicKeyCredentialDescriptorSchema = z.object({
	id: base64URLStringSchema,
	type: publicKeyCredentialTypeSchema,
	transports: z.array(authenticatorTransportFutureSchema),
});

export const authenticatorSelectionCriteriaSchema = z.object({
	authenticatorAttachment: authenticatorAttachmentSchema,
	residentKey: residentKeyRequirementSchema.optional(),
	requireResidentKey: z.boolean().default(false),
	userVerification: userVerificationRequirementSchema,
});

export const publicKeyCredentialCreationOptionsSchema = z.object({
	rp: publicKeyCredentialRpEntitySchema,
	user: publicKeyCredentialUserEntitySchema,
	challenge: base64URLStringSchema,
	pubKeyCredParams: z.array(publicKeyCredentialParametersSchema),
	timeout: z.number().optional(),
	excludeCredentials: z.array(publicKeyCredentialDescriptorSchema).optional(),
	authenticatorSelection: authenticatorSelectionCriteriaSchema.optional(),
	// attestation?: AttestationConveyancePreference,
	extensions: authenticationExtensionsClientInputsSchema.optional(),
});

export type PublicKeyCredentialCreationOptionsJSON = Evaluate<
	z.infer<typeof publicKeyCredentialCreationOptionsSchema>
>;

export const publicKeyCredentialRequestOptionsSchema = z.object({
	rpId: z.string(),
	challenge: base64URLStringSchema,
	timeout: z.number().optional(),
	allowCredentials: z.array(publicKeyCredentialDescriptorSchema).optional(),
	userVerification: userVerificationRequirementSchema,
	attestation: attestationConveyancePreferenceSchema.optional().default("none"),
	attestationFormats: z.array(attestationFormatSchema).optional().default([]),
	hints: z.array(publicKeyCredentialHintsSchema).optional().default([]),
	extensions: authenticationExtensionsClientInputsSchema.optional(),
});

export type PublicKeyCredentialRequestOptionsJSON = Evaluate<
	z.infer<typeof publicKeyCredentialRequestOptionsSchema>
>;