-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.chatbot_embed_settings (
  chatbot_id integer NOT NULL,
  widget_color character varying DEFAULT '#FFFFFF'::character varying,
  welcome_message text,
  initial_prompts jsonb,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT chatbot_embed_settings_pkey PRIMARY KEY (chatbot_id),
  CONSTRAINT chatbot_embed_settings_chatbot_id_fkey FOREIGN KEY (chatbot_id) REFERENCES public.chatbots(chatbot_id)
);
CREATE TABLE public.chatbot_queries (
  query_id bigint NOT NULL DEFAULT nextval('chatbot_queries_query_id_seq'::regclass),
  chatbot_id integer NOT NULL,
  user_id uuid NOT NULL,
  session_id uuid DEFAULT gen_random_uuid(),
  query_text text NOT NULL,
  response_text text,
  response_successful boolean,
  query_timestamp timestamp with time zone DEFAULT now(),
  tokens_used integer,
  source_references jsonb,
  CONSTRAINT chatbot_queries_pkey PRIMARY KEY (query_id),
  CONSTRAINT chatbot_queries_chatbot_id_fkey FOREIGN KEY (chatbot_id) REFERENCES public.chatbots(chatbot_id),
  CONSTRAINT chatbot_queries_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(user_id)
);
CREATE TABLE public.chatbots (
  chatbot_id integer NOT NULL DEFAULT nextval('chatbots_chatbot_id_seq'::regclass),
  user_id uuid NOT NULL,
  name character varying NOT NULL,
  description text,
  status USER-DEFINED DEFAULT 'inactive'::chatbot_status_enum,
  model_name character varying DEFAULT 'Gemini Pro'::character varying,
  temperature numeric DEFAULT 0.7 CHECK (temperature >= 0::numeric AND temperature <= 2::numeric),
  max_tokens integer DEFAULT 1024 CHECK (max_tokens > 0),
  last_document_or_setting_change_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT chatbots_pkey PRIMARY KEY (chatbot_id),
  CONSTRAINT chatbots_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(user_id)
);
CREATE TABLE public.documents (
  document_id integer NOT NULL DEFAULT nextval('documents_document_id_seq'::regclass),
  chatbot_id integer NOT NULL,
  user_id uuid NOT NULL,
  file_name character varying NOT NULL,
  file_type character varying,
  file_size_bytes bigint,
  page_count integer,
  embedding USER-DEFINED,
  uploaded_at timestamp with time zone DEFAULT now(),
  processing_status USER-DEFINED DEFAULT 'pending'::document_processing_status_enum,
  storage_bucket_id text DEFAULT 'chatbot_documents'::text,
  storage_object_path text NOT NULL,
  error_message text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT documents_pkey PRIMARY KEY (document_id),
  CONSTRAINT documents_chatbot_id_fkey FOREIGN KEY (chatbot_id) REFERENCES public.chatbots(chatbot_id),
  CONSTRAINT documents_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(user_id)
);
CREATE TABLE public.invoices (
  invoice_id integer NOT NULL DEFAULT nextval('invoices_invoice_id_seq'::regclass),
  user_id uuid NOT NULL,
  subscription_id integer,
  stripe_invoice_id text NOT NULL UNIQUE,
  invoice_number character varying,
  amount_due numeric NOT NULL,
  amount_paid numeric,
  currency character varying DEFAULT 'USD'::character varying,
  issue_date timestamp with time zone,
  due_date timestamp with time zone,
  paid_date timestamp with time zone,
  status USER-DEFINED DEFAULT 'pending'::invoice_status_enum,
  pdf_url text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT invoices_pkey PRIMARY KEY (invoice_id),
  CONSTRAINT invoices_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(user_id),
  CONSTRAINT invoices_subscription_id_fkey FOREIGN KEY (subscription_id) REFERENCES public.subscriptions(subscription_id)
);
CREATE TABLE public.payment_methods (
  payment_method_id integer NOT NULL DEFAULT nextval('payment_methods_payment_method_id_seq'::regclass),
  user_id uuid NOT NULL,
  stripe_payment_method_id text NOT NULL UNIQUE,
  card_brand character varying,
  last4 character varying,
  expiry_month integer,
  expiry_year integer,
  is_default boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT payment_methods_pkey PRIMARY KEY (payment_method_id),
  CONSTRAINT payment_methods_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(user_id)
);
CREATE TABLE public.plans (
  plan_id integer NOT NULL DEFAULT nextval('plans_plan_id_seq'::regclass),
  name character varying NOT NULL UNIQUE,
  price_monthly numeric NOT NULL,
  stripe_price_id text UNIQUE,
  max_chatbots integer,
  max_queries_per_month integer,
  max_document_pages_total integer,
  allows_custom_branding boolean DEFAULT false,
  email_support boolean DEFAULT false,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  CONSTRAINT plans_pkey PRIMARY KEY (plan_id)
);
CREATE TABLE public.profiles (
  user_id uuid NOT NULL,
  name character varying,
  email character varying UNIQUE,
  profile_picture_url text,
  current_plan_id integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (user_id),
  CONSTRAINT profiles_current_plan_id_fkey FOREIGN KEY (current_plan_id) REFERENCES public.plans(plan_id),
  CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.subscriptions (
  subscription_id integer NOT NULL DEFAULT nextval('subscriptions_subscription_id_seq'::regclass),
  user_id uuid NOT NULL,
  plan_id integer NOT NULL,
  stripe_subscription_id text UNIQUE,
  status USER-DEFINED NOT NULL,
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  cancel_at_period_end boolean DEFAULT false,
  cancelled_at timestamp with time zone,
  trial_start timestamp with time zone,
  trial_end timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT subscriptions_pkey PRIMARY KEY (subscription_id),
  CONSTRAINT subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(user_id),
  CONSTRAINT subscriptions_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.plans(plan_id)
);
CREATE TABLE public.user_api_keys (
  api_key_id integer NOT NULL DEFAULT nextval('user_api_keys_api_key_id_seq'::regclass),
  user_id uuid NOT NULL,
  service_name character varying NOT NULL,
  api_key_value_encrypted text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_api_keys_pkey PRIMARY KEY (api_key_id),
  CONSTRAINT user_api_keys_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(user_id)
);
CREATE TABLE public.user_preferences (
  user_id uuid NOT NULL,
  theme USER-DEFINED DEFAULT 'system'::user_theme_preference_enum,
  notifications_enabled boolean DEFAULT true,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_preferences_pkey PRIMARY KEY (user_id),
  CONSTRAINT user_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(user_id)
);