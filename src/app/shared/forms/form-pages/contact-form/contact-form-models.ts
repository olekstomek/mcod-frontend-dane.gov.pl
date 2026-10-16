import { FormControl, FormGroup } from '@angular/forms';
import {
  SuggestDatasetFieldsForm,
  SuggestDatasetFieldsFormValue,
} from '@app/shared/forms/form-parts/suggest-dataset-form-part/suggest-dataset-form-part-models';
import {
  FeedbackFieldsForm,
  FeedbackFieldsFormValue,
} from '@app/shared/forms/form-parts/feedback-fields-form-part/feedback-fields-models';
import { Observable } from 'rxjs';
import { NameEmailForm, NameEmailFormValue } from '@app/shared/forms/form-parts/name-email-form-part/name-email-models';
import {
  PoCoToFieldsForm,
  PoCoToFieldsFormValue,
} from '@app/shared/forms/form-parts/po-co-to-fields-form-part/po-co-to-fields-models';
import {
  GenericFieldsForm,
  GenericFieldsFormValue,
} from '@app/shared/forms/form-parts/generic-form-part/generic-models';
import { GenericSubmissionCategory, GenericSubmissionSubject } from '@app/services/models/generic-form';

export type ApiMap = Partial<Record<ContactCategory, (data: ContactFormValue) => Observable<unknown>>>;

export enum ContactTopic {
  Data = 'DATA',
  Portal = 'PORTAL',
  PersonalData = 'PERSONAL_DATA',
  LegalRegulations = 'LEGAL_REGULATIONS',
  Other = 'OTHER',
}

export enum ContactCategory {
  PortalFeatures = 'PORTAL_FEATURES',
  CreatingProfiles = 'CREATING_PROFILES',
  GrantingPermissions = 'GRANTING_PERMISSIONS',
  PortalErrors = 'PORTAL_ERRORS',
  PortalOther = 'PORTAL_OTHER',
  SharingData = 'SHARING_DATA',
  SuggestData = 'SUGGEST_DATA',
  SuggestReuse = 'SUGGEST_REUSE',
  DataFeedback = 'DATA_FEEDBACK',
  DataOpenness = 'DATA_OPENNESS',
  HVD = 'HVD',
  DGA = 'DGA',
  DataOther = 'DATA_OTHER',
}

export interface ContactSelectOption<T> {
  value: T;
  label: string;
}

export const TOPIC_OPTIONS: ContactSelectOption<ContactTopic>[] = [
  { value: ContactTopic.Data, label: 'Forms.TopicSection.TopicSelect.Option1' },
  { value: ContactTopic.Portal, label: 'Forms.TopicSection.TopicSelect.Option2' },
  { value: ContactTopic.PersonalData, label: 'Forms.TopicSection.TopicSelect.Option3' },
  { value: ContactTopic.LegalRegulations, label: 'Forms.TopicSection.TopicSelect.Option4' },
  { value: ContactTopic.Other, label: 'Forms.TopicSection.TopicSelect.Option5' },
];

export const CATEGORY_OPTIONS: Partial<Record<ContactTopic, ContactSelectOption<ContactCategory>[]>> = {
  [ContactTopic.Data]: [
    { value: ContactCategory.SharingData, label: 'Forms.TopicSection.CategorySelect.Option6' },
    { value: ContactCategory.SuggestData, label: 'Forms.TopicSection.CategorySelect.Option7' },
    { value: ContactCategory.SuggestReuse, label: 'Forms.TopicSection.CategorySelect.Option8' },
    { value: ContactCategory.DataFeedback, label: 'Forms.TopicSection.CategorySelect.Option9' },
    { value: ContactCategory.DataOpenness, label: 'Forms.TopicSection.CategorySelect.Option10' },
    { value: ContactCategory.HVD, label: 'Forms.TopicSection.CategorySelect.Option11' },
    { value: ContactCategory.DGA, label: 'Forms.TopicSection.CategorySelect.Option12' },
    { value: ContactCategory.DataOther, label: 'Forms.TopicSection.CategorySelect.Option13' },
  ],
  [ContactTopic.Portal]: [
    { value: ContactCategory.PortalFeatures, label: 'Forms.TopicSection.CategorySelect.Option1' },
    { value: ContactCategory.CreatingProfiles, label: 'Forms.TopicSection.CategorySelect.Option2' },
    { value: ContactCategory.GrantingPermissions, label: 'Forms.TopicSection.CategorySelect.Option3' },
    { value: ContactCategory.PortalErrors, label: 'Forms.TopicSection.CategorySelect.Option4' },
    { value: ContactCategory.PortalOther, label: 'Forms.TopicSection.CategorySelect.Option5' },
  ],
};

export interface ContactForm {
  topic: FormControl<ContactTopic | null>;
  category: FormControl<ContactCategory | null>;
  captcha: FormControl<string | null>;
  nameEmail?: FormGroup<NameEmailForm>;
  suggestDatasetFields?: FormGroup<SuggestDatasetFieldsForm>;
  poCoToFields?: FormGroup<PoCoToFieldsForm>;
  feedbackFields?: FormGroup<FeedbackFieldsForm>;
  genericFields?: FormGroup<GenericFieldsForm>;
}

export interface ContactFormValue {
  topic: ContactTopic | null;
  category: ContactCategory | null;
  captcha: string | null;
  nameEmail?: NameEmailFormValue;
  suggestDatasetFields?: SuggestDatasetFieldsFormValue;
  feedbackFields?: FeedbackFieldsFormValue;
  poCoToFields?: PoCoToFieldsFormValue;
  genericFields?: GenericFieldsFormValue;
}

export interface GenericSubmitData {
  topic: ContactTopic | null;
  category: ContactCategory | null;
  nameEmail?: NameEmailFormValue;
  genericFields?: GenericFieldsFormValue;
}

export const CATEGORY_TO_SUBJECT: Partial<Record<ContactCategory, GenericSubmissionSubject>> = {
  [ContactCategory.SharingData]: GenericSubmissionSubject.Data,
  [ContactCategory.DataOpenness]: GenericSubmissionSubject.Data,
  [ContactCategory.HVD]: GenericSubmissionSubject.Data,
  [ContactCategory.DGA]: GenericSubmissionSubject.Data,
  [ContactCategory.DataOther]: GenericSubmissionSubject.Data,
  [ContactCategory.PortalFeatures]: GenericSubmissionSubject.Portal,
  [ContactCategory.CreatingProfiles]: GenericSubmissionSubject.Portal,
  [ContactCategory.GrantingPermissions]: GenericSubmissionSubject.Portal,
  [ContactCategory.PortalErrors]: GenericSubmissionSubject.Portal,
  [ContactCategory.PortalOther]: GenericSubmissionSubject.Portal,
};

export const CATEGORY_TO_BACKEND_CATEGORY: Partial<Record<ContactCategory, GenericSubmissionCategory>> = {
  [ContactCategory.SharingData]: GenericSubmissionCategory.Sharing,
  [ContactCategory.DataOpenness]: GenericSubmissionCategory.Standards,
  [ContactCategory.HVD]: GenericSubmissionCategory.Hvd,
  [ContactCategory.DGA]: GenericSubmissionCategory.Dga,
  [ContactCategory.DataOther]: GenericSubmissionCategory.Other,
  [ContactCategory.PortalFeatures]: GenericSubmissionCategory.Features,
  [ContactCategory.CreatingProfiles]: GenericSubmissionCategory.Profiles,
  [ContactCategory.GrantingPermissions]: GenericSubmissionCategory.Permissions,
  [ContactCategory.PortalErrors]: GenericSubmissionCategory.Bugs,
  [ContactCategory.PortalOther]: GenericSubmissionCategory.Other,
};

export const TOPIC_TO_SUBJECT: Partial<Record<ContactTopic, GenericSubmissionSubject>> = {
  [ContactTopic.PersonalData]: GenericSubmissionSubject.DataProtection,
  [ContactTopic.LegalRegulations]: GenericSubmissionSubject.Legal,
  [ContactTopic.Other]: GenericSubmissionSubject.Other,
};
