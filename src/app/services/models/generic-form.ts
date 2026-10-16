export enum GenericSubmissionSubject {
  Data = 'DATA',
  Portal = 'PORTAL',
  DataProtection = 'DATA_PROTECTION',
  Legal = 'LEGAL',
  Other = 'OTHER',
}

export enum GenericSubmissionCategory {
  Sharing = 'SHARING',
  Standards = 'STANDARDS',
  Hvd = 'HVD',
  Dga = 'DGA',
  Features = 'FEATURES',
  Profiles = 'PROFILES',
  Permissions = 'PERMISSIONS',
  Bugs = 'BUGS',
  Other = 'OTHER',
}

export interface GenericSubmissionAttributes {
  subject: GenericSubmissionSubject;
  category?: GenericSubmissionCategory;
  content: string;
  applicant_full_name?: string;
  applicant_email?: string;
}

export interface GenericSubmissionResponse {
  data: {
    id: string;
    type: 'generic-contact-submission';
    attributes: {
      message: string;
    };
    links: {
      self: string;
    };
  };
}
