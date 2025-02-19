type DbPaths =
  | "admin"
  | "admin/name"
  | "admin/public_email"
  | "admin/phone"
  | "admin/prefix"
  | "admin/suffix"
  | "admin/image"
  | "admin/login_emails"
  | `admin/login_emails/${string}` // Dynamic email keys
  | "admin/dob"
  | "admin/job"
  | "admin/bio"
  | "admin/skills"
  | `admin/skills/${string}` // Dynamic skill names
  | `admin/skills/${string}/name`
  | `admin/skills/${string}/icon_url`
  | "admin/socials"
  | `admin/socials/${string}` // Dynamic social IDs
  | `admin/socials/${string}/name`
  | `admin/socials/${string}/url`
  | "config"
  | "config/google_auth"
  | "config/email_auth"
  | "config/github_auth"
  | "config/password_auth";

declare namespace Db {
  /** Admin data */
  interface Admin {
    name?: string;
    /** Email that will be visible to portfolio's visitors */
    public_email?: string;
    /** Phone number, must include country code */
    phone?: string;
    /** e.g Mr, Dr, Rev etc. */
    prefix?: string;
    /** e.g. Ph.D */
    suffix?: string;
    /** Link to owner's display image */
    image?: string;
    /** A list of private emails the user can login with */
    login_emails?: {
      [email: string]: string;
    };
    /** User's date of birth, should only be added if this information is to be visible to the general public */
    dob?: string;
    job?: string;
    bio?: string;
    skills?: {
      [name: string]: {
        name: string;
        icon_url?: string;
      };
    };
    socials?: {
      [id: string]: {
        name: Social;
        url: string;
      };
    };
  };
  /** Site configuration data */
  interface Config {
    google_auth?: boolean;
    email_auth?: boolean;
    github_auth?: boolean;
    password_auth?: boolean;
  };
}

type SelectedSocials = Db.Admin["socials"][string] & {
  id: string;
};
