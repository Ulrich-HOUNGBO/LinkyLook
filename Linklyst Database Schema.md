-- PostgreSQL Schema for User Management, Permissions, and Domains
-- Users table to store user accounts
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Roles table for role-based access control (Admin, Manager, Assistant)
CREATE TABLE roles (
    role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name VARCHAR(50) NOT NULL UNIQUE, -- e.g., 'Admin', 'Manager', 'Assistant'
    description TEXT
);

-- User_roles table to assign roles to users
CREATE TABLE user_roles (
    user_role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(role_id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Links table for secure "Shield" redirection links
CREATE TABLE links (
    link_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    target_url TEXT NOT NULL, -- Final URL (e.g., OnlyFans)
    decoy_url TEXT, -- URL for bots (e.g., Google)
    short_code VARCHAR(50) UNIQUE NOT NULL, -- Shortened link code
    expires_at TIMESTAMP WITH TIME ZONE, -- Optional expiration
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Permissions table to define specific permissions (e.g., edit links, view stats)
CREATE TABLE permissions (
    permission_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    permission_name VARCHAR(50) NOT NULL UNIQUE, -- e.g., 'edit_link', 'view_stats'
    description TEXT
);

-- Role_permissions table to assign permissions to roles
CREATE TABLE role_permissions (
    role_permission_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID REFERENCES roles(role_id) ON DELETE RESTRICT,
    permission_id UUID REFERENCES permissions(permission_id) ON DELETE RESTRICT
);

-- Campaigns table for agency-focused model/project management
CREATE TABLE campaigns (
    campaign_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Campaign_links table to associate links with campaigns
CREATE TABLE campaign_links (
    campaign_link_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
    link_id UUID REFERENCES links(link_id) ON DELETE CASCADE
);

-- Custom_domains table for premium domain support
CREATE TABLE custom_domains (
    domain_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    domain_name VARCHAR(255) UNIQUE NOT NULL,
    cname_record VARCHAR(255), -- DNS CNAME record
    ssl_status VARCHAR(50) DEFAULT 'pending', -- e.g., 'pending', 'active', 'failed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- API_integrations table for OnlyFans/Inflow API connections
CREATE TABLE api_integrations (
    integration_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL, -- e.g., 'OnlyFans', 'Inflow'
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- MongoDB Schema (JSON representation for NoSQL collections)
-- Pages collection for landing pages
{
  "pages": {
    "page_id": "UUID",
    "user_id": "UUID",
    "slug": "string", // e.g., 'username' for linklyst.com/username
    "title": "string",
    "theme": {
      "colors": { "primary": "string", "background": "string" },
      "font": "string",
      "icons": ["string"]
    },
    "blocks": [
      {
        "type": "string", // e.g., 'link', 'text', 'image', 'video', 'button'
        "content": "object", // Varies by type (e.g., { url: "string" } for links)
        "order": "number"
      }
    ],
    "created_at": "ISODate",
    "updated_at": "ISODate"
  }
}

-- Analytics collection for tracking link and page performance
{
  "analytics": {
    "event_id": "UUID",
    "link_id": "UUID", // Optional, for link-specific analytics
    "page_id": "UUID", // Optional, for page-specific analytics
    "campaign_id": "UUID", // Optional, for campaign analytics
    "event_type": "string", // e.g., 'click', 'bot_detected'
    "user_agent": "string",
    "ip_address": "string",
    "geo_location": { "country": "string", "city": "string" },
    "device_type": "string", // e.g., 'mobile', 'desktop'
    "os": "string",
    "browser": "string",
    "referrer": "string", // Optional, for UTM/referrer tracking
    "timestamp": "ISODate"
  }
}

-- Bot_blacklist collection for bot detection
{
  "bot_blacklist": {
    "blacklist_id": "UUID",
    "user_agent_pattern": "string", // Regex or exact match
    "ip_address": "string", // Optional
    "platform": "string", // e.g., 'Instagram', 'Facebook'
    "last_updated": "ISODate"
  }
}

-- Indexes for PostgreSQL
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_links_user_id ON links(user_id);
CREATE INDEX idx_links_short_code ON links(short_code);
CREATE INDEX idx_campaign_links_campaign_id ON campaign_links(campaign_id);
CREATE INDEX idx_custom_domains_user_id ON custom_domains(user_id);

-- Indexes for MongoDB
{
  "pages": [
    { "key": { "user_id": 1, "slug": 1 }, "unique": true },
    { "key": { "created_at": 1 } }
  ],
  "analytics": [
    { "key": { "link_id": 1, "timestamp": 1 } },
    { "key": { "page_id": 1, "timestamp": 1 } },
    { "key": { "campaign_id": 1, "timestamp": 1 } }
  ],
  "bot_blacklist": [
    { "key": { "user_agent_pattern": 1 } },
    { "key": { "ip_address": 1 } }
  ]
}