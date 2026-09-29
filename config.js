// Optional public Supabase connection for all seven remote game modes + the public mark wall.
// Put a publishable key (sb_publishable_...) here, or a legacy anon JWT as a fallback.
// Never put an sb_secret_... or service_role key in browser code.
window.TESTHEM_CONFIG = {
  supabaseUrl: '',
  supabasePublishableKey: '',
  // Optional legacy anon JWT. If supplied, it is used as the Authorization bearer.
  supabaseAnonKey: ''
};
