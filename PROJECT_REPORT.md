# PROJECT REPORT

---

# **CarbonTrack™: Enterprise & Campus Carbon Footprint Telemetry, Analytics, and Ecological Offset Ecosystem**

**Academic & Technical Capstone Documentation**  
**Master of Computer Applications (MCA)**  
**Department of Computer Science & Engineering**  
**Lovely Professional University, Punjab, India**

---

### **Project Metadata**
* **Project Title:** CarbonTrack™ (Carbon Tracker Platform)
* **Candidate Name:** Divakar Pandey
* **Email:** pandeydivakar07@gmail.com / pandeydivakar1080@gmail.com
* **Institution:** Lovely Professional University (LPU), Punjab, India
* **Repository:** [divakarpandey07/Carbon-Tracker](https://github.com/divakarpandey07/Carbon-Tracker)
* **Frontend Production URL:** [https://carbon-tracker-olive.vercel.app](https://carbon-tracker-olive.vercel.app)
* **Backend Production URL:** [https://carbontracker-jr2i.onrender.com](https://carbontracker-jr2i.onrender.com)
* **Architecture:** Decoupled Micro-Monolith (MERN Stack: MongoDB Atlas, Express.js, React 18, Node.js)

---

## **Abstract**

In the modern anthropocene, pervasive greenhouse gas (GHG) emissions represent the predominant driver of anthropogenic climate destabilization. While international accords like the Paris Agreement and standards such as ISO 14064 mandate systematic carbon accountability, corporate organizations, campuses, and individuals frequently lack verifiable, real-time telemetry systems to quantify, monitor, and mitigate their environmental footprint. Existing tracking utilities are largely siloed, static, or restricted to coarse annual estimations without actionable feedback or authenticated offsetting channels.

**CarbonTrack™** is an end-to-end cloud platform engineered to bridge the divide between environmental data ingestion and tangible climate action. Built upon the MERN (MongoDB, Express.js, React, Node.js) architecture, CarbonTrack provides:
1. **Granular Multi-Source Activity Telemetry:** Real-time calculation of $CO_2e$ emissions across mobility, power grids, dietary habits, industrial waste, and digital consumption based on GHG Protocol and IPCC emission factors.
2. **Automated Batch Ingestion Engine:** Multi-format file ingestion (CSV, JSON, plain text utility invoices) enabling algorithmic extraction, activity categorization, emission calculation, and dynamic eco-recommendations.
3. **Interactive Telemetry Visualizations:** Multi-dimensional charts and time-series analytics illustrating emissions trajectories, category distribution, and net neutrality balances.
4. **Verified Carbon Offset Marketplace:** Direct connection to accredited carbon offset initiatives (afforestation, renewable energy, methane capture) with instant credit retirement workflows and provider verification audits.
5. **Gamification & Behavioral Incentive Framework:** Competitive campus and regional challenges, streak counters, tiered badges, and dynamic peer leaderboards designed to induce lasting pro-environmental behavior.
6. **Enterprise Governance & Audit Console:** Comprehensive administrative controls for user management, emission factor tuning, provider KYC verification, and organizational reporting.

---

## **Table of Contents**
1. [Introduction & Problem Statement](#1-introduction--problem-statement)
2. [Literature Survey & Comparative Analysis](#2-literature-survey--comparative-analysis)
3. [System Requirements Specification (SRS)](#3-system-requirements-specification-srs)
4. [System Architecture & High-Level Design](#4-system-architecture--high-level-design)
5. [Mathematical & Scientific Emission Modeling](#5-mathematical--scientific-emission-modeling)
6. [Database Architecture & Entity-Relationship Modeling](#6-database-architecture--entity-relationship-modeling)
7. [Detailed System Modules & Functional Workflows](#7-detailed-system-modules--functional-workflows)
8. [Automated File Ingestion & Parsing Engine](#8-automated-file-ingestion--parsing-engine)
9. [RESTful API Specifications](#9-restful-api-specifications)
10. [User Interface Design & Experience Architecture](#10-user-interface-design--experience-architecture)
11. [Security, Authentication & Authorization Architecture](#11-security-authentication--authorization-architecture)
12. [Testing, Validation & Quality Assurance](#12-testing-validation--quality-assurance)
13. [Deployment, Infrastructure & CI/CD Pipeline](#13-deployment-infrastructure--cicd-pipeline)
14. [Conclusion & Future Roadmap](#14-conclusion--future-roadmap)

---

## **1. Introduction & Problem Statement**

### **1.1 Background**
Climate change is recognized as one of the defining challenges of modern civilization. The United Nations Framework Convention on Climate Change (UNFCCC) and the Intergovernmental Panel on Climate Change (IPCC) have emphasized the urgent imperative to constrain global mean temperature rise to within $1.5^\circ\text{C}$ relative to pre-industrial baselines. Achieving net-zero greenhouse gas emissions necessitates rigorous measurement, transparent verification, and proactive mitigation at individual, campus, and corporate institutional levels.

### **1.2 The Problem Statement**
Despite widespread awareness regarding ecological sustainability, existing carbon accounting implementations suffer from critical systemic bottlenecks:
* **Manual Data Entry Burden:** Users and institutions are deterred by tedious questionnaire-style logging, leading to high abandonment rates and discontinuous telemetry.
* **Absence of Unstructured File Processing:** Operational emission data resides in varied formats (such as utility receipts, electricity bills, and fleet fuel logs) which traditional platforms cannot ingest automatically.
* **Opacity of Offsetting Mechanisms:** Conventional carbon offset initiatives frequently suffer from "greenwashing", double-counting of credits, and lack of transparent provider accreditation.
* **Absence of Behavioral Gamification:** Static metric display fails to sustain long-term stakeholder engagement, missing the catalytic potential of social mechanics and competitive incentives.
* **Fragmented Administrative Oversight:** Institutional leaders lack centralized governance consoles to monitor campus-wide or corporate-wide emission patterns and compliance metrics.

### **1.3 Project Objectives**
The primary design and technical objectives of CarbonTrack™ comprise:
1. Developing a high-performance, responsive Single Page Application (SPA) with dedicated, authenticated User and Administrator access portals.
2. Formulating a standardized emission engine computing $CO_2$ equivalents ($kg\ CO_2e$) across seven core activity verticals using internationally recognized emission factors ($EF$).
3. Implementing an automated file ingestion module capable of parsing structured tabular files (CSV) and semi-structured text invoices to deliver instant carbon telemetry without manual row-by-row input.
4. Engineering an interactive, accredited carbon offset marketplace facilitating credit retirement, order transaction tracking, and provider application vetting.
5. Designing a scalable gamification engine with real-time leaderboard aggregation, automated challenge completion checks, and activity streak validation.
6. Ensuring enterprise-grade security via salted Bcrypt password hashing, stateless JSON Web Tokens (JWT), role-based middleware access protection, and strict sanitization.

---

## **2. Literature Survey & Comparative Analysis**

| Feature Matrix | Traditional Calculators (e.g. WWF, EPA) | Commercial Enterprise ESG (e.g. Persefoni, Watershed) | **CarbonTrack™ (Proposed Platform)** |
| :--- | :--- | :--- | :--- |
| **Target Audience** | General Public (Annual rough estimate) | Fortune 500 Enterprises (Heavy enterprise pricing) | Hybrid: University Campuses, Organizations & Individuals |
| **Telemetry Cadence** | Coarse / Annual Static | Scheduled Quarterly / Annual ERP Sync | Real-Time, Event-Driven & Continuous |
| **File Parsing Engine** | ❌ None | ✔ Enterprise API Connectors | ✔ Built-in CSV / Bill Ingestion Engine |
| **Gamification & Social** | ❌ None | ❌ None | ✔ Quests, Badges, Streaks & Live Leaderboard |
| **Offset Marketplace** | ❌ Educational external links | ✔ Custom B2B contracts | ✔ Integrated Credit Purchasing & Retirement |
| **Cost & Openness** | Free but static | Extremely expensive proprietary SaaS | Open-standard, Full MERN Architecture |
| **Role-Based Portals** | ❌ Single guest view | ✔ Enterprise IAM integration | ✔ Granular Dual Portals (User & Super Admin) |

---

## **3. System Requirements Specification (SRS)**

### **3.1 Hardware Requirements**
* **Development / Client System:**
  * CPU: Dual-Core 2.0 GHz or higher (x86_64 / ARM64 architecture)
  * RAM: 4 GB minimum (8 GB recommended for concurrent builds)
  * Disk Space: 500 MB free storage for dependencies and caching
* **Production Cloud Infrastructure:**
  * Node.js Execution Tier: Minimum 512 MB RAM container instance (Render Web Service)
  * Database Cluster: Shared / Dedicated MongoDB Atlas M0/M10 multi-region replica set
  * Edge CDN: Vercel Global Edge Network with automatic SSL termination

### **3.2 Software & Platform Stack**
* **Frontend Layer:**
  * Framework: React.js (v18.3.1) Single Page Application
  * Routing: React Router DOM (v6.22) with Declarative Route Guards
  * Styling: Tailwind CSS (v3.4) with Custom Obsidian Forest Theme
  * Data Visualization: Recharts (v2.12) Responsive SVG Rendering
  * HTTP Client: Axios (v1.6) with Request/Response Interceptors
* **Backend Layer:**
  * Runtime Environment: Node.js (v18 LTS / v20 LTS / v24)
  * Web Framework: Express.js (v5.1) REST API Architecture
  * ODM: Mongoose (v9.0) Object Data Modeling with Schema Validation
  * Cryptography: BcryptJS (v2.4.3) with 10 salt rounds, JSONWebToken (v9.0)
  * Multipart / File Stream: Multer (v1.4.5), CSV-Parser (v3.0.0)
* **Database & Hosting:**
  * Database Engine: MongoDB Atlas (MongoDB v7.0/8.0 wire protocol)
  * Frontend Hosting: Vercel Platform with SPA Rewrite Rules
  * Backend Hosting: Render Managed Web Service Platform
  * Version Control: Git & GitHub Enterprise

---

## **4. System Architecture & High-Level Design**

CarbonTrack™ adopts a **3-Tier Decoupled Client-Server Architecture** conforming to REST architectural constraints and stateless session management.

```mermaid
flowchart TD
    subgraph ClientLayer["Client Layer (Vercel Edge CDN)"]
        UI["React 18 SPA (Tailwind CSS + Recharts)"]
        AuthContext["Auth State & LocalStorage Token"]
        AxiosInterceptor["Axios Interceptor (Bearer Token Header)"]
        UI --> AuthContext
        UI --> AxiosInterceptor
    end

    subgraph GatewayLayer["Network & Transport Layer"]
        HTTPS["TLS / HTTPS Encryption (Port 443)"]
        CORS["Cross-Origin Resource Sharing (CORS)"]
        AxiosInterceptor --> HTTPS
        HTTPS --> CORS
    end

    subgraph ServerLayer["Application Server Layer (Render Web Service)"]
        ExpressApp["Express.js Server (Port 5000 / Dynamic)"]
        CORS --> ExpressApp
        
        subgraph Middlewares["Security & Parsing Middleware"]
            AuthMiddleware["authMiddleware (protect & authorize)"]
            UploadMiddleware["uploadMiddleware (Multer Memory/Disk Engine)"]
        end
        
        ExpressApp --> AuthMiddleware
        ExpressApp --> UploadMiddleware

        subgraph Controllers["Business Logic Controllers"]
            AuthController["authController (Login, Register, Sync)"]
            ActivityController["activityController (Log, Metrics, Trends)"]
            UploadController["uploadController (CSV, Parsing, Recommendation)"]
            ChallengeController["challengeController (Quests, Leaderboards)"]
            OffsetController["offsetController (Marketplace, Retirements)"]
            AdminController["adminController (Governance, Audits)"]
        end

        AuthMiddleware --> AuthController
        AuthMiddleware --> ActivityController
        UploadMiddleware --> UploadController
        AuthMiddleware --> ChallengeController
        AuthMiddleware --> OffsetController
        AuthMiddleware --> AdminController
    end

    subgraph DataLayer["Persistence Layer (MongoDB Atlas Cluster)"]
        MongoDB[("MongoDB Atlas Replica Set (Cluster0)")]
        UserColl[("Users Collection")]
        ActivityColl[("Activities Collection")]
        ChallengeColl[("Challenges & Participants")]
        OffsetColl[("Listings & Purchases")]

        MongoDB --- UserColl
        MongoDB --- ActivityColl
        MongoDB --- ChallengeColl
        MongoDB --- OffsetColl
    end

    Controllers -->|Mongoose ODM v9.0| MongoDB
```

### **4.1 Architectural Subsystems**
1. **Presentation Layer:** Client-side rendered React components providing dynamic state hydration, declarative routing, role-based navigation guards, and accessible interfaces.
2. **REST API Service Tier:** Express router handling input validation, JWT claims verification, algorithmic computations, and deterministic response statuses.
3. **Storage & Schema Tier:** MongoDB database maintaining index optimization, pre-save cryptographic hooks, compound aggregations, and strict referential integrity.

---

## **5. Mathematical & Scientific Emission Modeling**

The core calculation engine in CarbonTrack™ computes Greenhouse Gas emissions formatted in **equivalent kilograms of carbon dioxide ($kg\ CO_2e$)**. The computation conforms to the **GHG Protocol Corporate Standard** and **IPCC Guidelines for National Greenhouse Gas Inventories**:

$$\text{Emission } (E) = \text{Activity Quantity } (Q) \times \text{Emission Factor } (EF)$$

Where:
* $E$ represents Total Carbon Dioxide Equivalent emitted ($kg\ CO_2e$).
* $Q$ represents the quantified user activity metric (e.g., kilometers traversed, kilowatt-hours consumed, kilograms purchased, meals consumed).
* $EF$ represents the empirical greenhouse gas emission factor indexed per unit of consumption.

### **5.1 Standardized Emission Factor Coefficient Matrix**

| Domain Category | Activity Sub-Type | Unit ($Q$) | Emission Factor ($EF$) in $kg\ CO_2e/\text{unit}$ | Reference Baseline |
| :--- | :--- | :--- | :--- | :--- |
| **Transport** | Electric Train / Metro | Kilometers ($km$) | **$0.041$** | DEFRA UK Grid Average |
| **Transport** | Electric Vehicle (EV) | Kilometers ($km$) | **$0.053$** | Grid-Charged Average |
| **Transport** | Compressed Natural Gas (CNG) | Kilometers ($km$) | **$0.059$** | Central Pollution Control |
| **Transport** | Public Transit Bus | Kilometers ($km$) | **$0.089$** | Average Fleet Passenger Load |
| **Transport** | Commercial Flight | Kilometers ($km$) | **$0.150$** | ICAO Radiative Forcing |
| **Transport** | Motorbike / Scooter | Kilometers ($km$) | **$0.103$** | 150cc Internal Combustion |
| **Transport** | Petrol Passenger Vehicle | Kilometers ($km$) | **$0.192$** | EPA Standard Sedan |
| **Transport** | Diesel Passenger Vehicle | Kilometers ($km$) | **$0.171$** | Heavy Fleet Standard |
| **Energy** | Solar / Wind Renewable | Kilowatt-hour ($kWh$) | **$0.000$** | Zero Operational Scope 2 |
| **Energy** | National Electricity Grid | Kilowatt-hour ($kWh$) | **$0.820$** | CEA India Average Grid Intensity |
| **Energy** | Liquefied Petroleum Gas (LPG) | Kilograms ($kg$) | **$2.980$** | Stoichiometric Combustion |
| **Energy** | Natural Gas Pipe (PNG) | Standard $m^3$ | **$1.900$** | Residential Utility Baseline |
| **Diet / Food** | Vegan Meal Plan | Per Day / Meal | **$1.500$** | Poore & Nemecek (Science 2018) |
| **Diet / Food** | Vegetarian Meal Plan | Per Day / Meal | **$2.500$** | Dairy Inclusion Model |
| **Diet / Food** | Omnivore Standard Meal | Per Day / Meal | **$5.400$** | Mixed Meat & Grain Balance |
| **Diet / Food** | Beef-Heavy Meal Plan | Per Day / Meal | **$7.200$** | Ruminant Enteric Fermentation |
| **Waste** | Recycled Stream | Kilograms ($kg$) | **$0.050$** | Mechanical Sorting Baseline |
| **Waste** | Composted Organic Waste | Kilograms ($kg$) | **$0.100$** | Managed Aerobic Digestion |
| **Waste** | Municipal Landfill Dump | Kilograms ($kg$) | **$0.580$** | Anaerobic Methane Release |
| **Digital** | Cloud Data Storage | Gigabyte / Month ($GB$) | **$0.005$** | PUE 1.2 Data Center Factor |
| **Digital** | Video Streaming Transmission | Hours ($hr$) | **$0.036$** | IEA Network Transmission Model |

### **5.2 Aggregate Footprint & Net-Zero Balance Equations**
For any user $u$ across time interval $[t_0, t_1]$, Gross Carbon Footprint ($CF_{gross}$) is determined by:

$$CF_{gross}(u) = \sum_{i=1}^{N} \left( Q_i \times EF_i \right)$$

Net Carbon Footprint ($CF_{net}$) accounts for certified carbon offset retirements ($OR$):

$$CF_{net}(u) = \max\left(0,\ CF_{gross}(u) - \sum_{j=1}^{M} OR_j\right)$$

When $CF_{net}(u) = 0$, the individual or entity satisfies the **Carbon Neutrality Metric**.

---

## **6. Database Architecture & Entity-Relationship Modeling**

The database layer utilizes a document-oriented structure within MongoDB Atlas, enforcing data validation rules through Mongoose schemas.

```mermaid
erDiagram
    USER ||--o{ ACTIVITY : logs
    USER ||--o{ CHALLENGE_PARTICIPANT : enters
    USER ||--o{ OFFSET_PURCHASE : retires
    USER ||--o{ CHALLENGE : creates
    CHALLENGE ||--o{ CHALLENGE_PARTICIPANT : tracks
    OFFSET_LISTING ||--o{ OFFSET_PURCHASE : supplies
    USER ||--o{ OFFSET_LISTING : manages

    USER {
        ObjectId _id PK
        string name
        string email UK
        string password "Bcrypt Hash (select: false)"
        string role "admin | user"
        string organization
        string providerStatus "not_applied | pending | verified | rejected"
        boolean isActive
        date createdAt
    }

    ACTIVITY {
        ObjectId _id PK
        ObjectId user FK
        string category "transport | electricity | food | waste | digital | water"
        string subType "car | flight | vegan | grid | etc."
        number quantity
        string unit "km | kWh | meals | kg | GB"
        number co2Emitted "Computed in kg CO2e"
        date activityDate
        string notes
    }

    CHALLENGE {
        ObjectId _id PK
        string title
        string description
        string category
        string targetType "reduce_co2 | log_count | streak_days"
        number targetValue
        number pointsReward
        date startDate
        date endDate
        ObjectId createdBy FK
        boolean isActive
    }

    CHALLENGE_PARTICIPANT {
        ObjectId _id PK
        ObjectId challenge FK
        ObjectId user FK
        number progressValue
        boolean isCompleted
        number pointsEarned
        date joinedAt
    }

    OFFSET_LISTING {
        ObjectId _id PK
        string title
        string description
        string offsetType "tree_planting | renewable_energy | methane_capture | ocean_cleanup"
        number pricePerUnit
        string unit "ton_co2 | tree_planted | kwh_green"
        number totalAvailable
        number totalSold
        ObjectId provider FK
        boolean isVerified
    }

    OFFSET_PURCHASE {
        ObjectId _id PK
        ObjectId user FK
        ObjectId listing FK
        number unitsPurchased
        number totalAmountPaid
        number co2OffsetKg
        string certificateId UK
        date purchasedAt
    }
```

---

## **7. Detailed System Modules & Functional Workflows**

### **7.1 Authentication & Dual-Portal Routing Architecture**
The system implements a hardened authentication gateway differentiating between standard **User Accounts** and **Administrator Consoles**.

```mermaid
flowchart TD
    Start([User visits /login]) --> SelectMode{Select Mode}
    SelectMode -->|User Tab| UserForm[Enter User Credentials]
    SelectMode -->|Admin Tab| AdminForm[Enter Admin Credentials]
    
    UserForm --> Submit[Submit Login Request]
    AdminForm --> Submit
    
    Submit --> PostAPI[POST /api/auth/login]
    PostAPI --> FindUser{Find user by Email?}
    
    FindUser -->|No| Reject401[Return 401: Invalid Credentials]
    FindUser -->|Yes| CheckPassword{Bcrypt.compare matches?}
    
    CheckPassword -->|No| Reject401
    CheckPassword -->|Yes| VerifyRole{Is Admin tab & user.role == admin?}
    
    VerifyRole -->|Role Mismatch| DenyAdmin[Frontend Guard: Access Denied]
    VerifyRole -->|Valid Admin| ReturnAdminJWT[Generate JWT token role: admin]
    VerifyRole -->|Valid User| ReturnUserJWT[Generate JWT token role: user]
    
    ReturnAdminJWT --> SaveToken[Store Token in localStorage]
    ReturnUserJWT --> SaveToken
    
    SaveToken --> RouteCheck{User Role?}
    RouteCheck -->|admin| NavAdmin[Redirect to /admin Governance]
    RouteCheck -->|user| NavDash[Redirect to /dashboard Telemetry]
```

---

## **8. Automated File Ingestion & Parsing Engine**

One of the standout features of CarbonTrack™ is the **File Ingestion & Automated Emission Telemetry Engine**. Users and institutional administrators can upload tabular spreadsheets (CSV) or digitized utility invoices. The system processes the file in memory, automatically categorizes activities, calculates carbon footprints, and generates sustainable alternatives.

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Facility Admin
    participant UI as FileUploadModal (React)
    participant API as /api/upload/analyze-carbon (Express)
    participant Multer as Multer Memory Storage
    participant Parser as CSV / Stream Parser Engine
    participant Engine as Emission Factors Engine
    participant DB as MongoDB Atlas

    User->>UI: Drag & Drop CSV / Bill File (e.g. transport_log.csv)
    UI->>API: Multipart POST /api/upload/analyze-carbon
    API->>Multer: Buffer File Stream & Validate MIME / Extension
    Multer-->>API: Validated File Buffer
    API->>Parser: Ingest Buffer & Stream Row-by-Row
    Parser->>Parser: Normalize Headers (category, quantity, unit, vehicle)
    Parser->>Engine: Match Emission Factor (Q * EF)
    Engine-->>Parser: Row-wise kg CO2e computed
    Parser->>Parser: Aggregate Totals & Detect Dominant Category
    Parser->>Engine: Formulate Mitigation Recommendations
    Parser-->>API: JSON: { totalCO2, recordCount, categoryBreakdown, recommendations }
    API-->>UI: 200 OK + Analytical Payload
    UI->>User: Render Interactive Visual Breakdown & Save Logs Prompt
    opt Commit to Database
        User->>UI: Click "Save to Activity Log"
        UI->>DB: Batch Insert into Activities Collection
        DB-->>UI: Activities Persisted & Dashboard Hydrated
    end
```

### **8.1 Technical Capabilities of the Upload Engine**
1. **Dynamic Header Mapping:** Flexibly identifies headers like `quantity`, `amount`, `km`, `distance`, `kwh`, `type`, `vehicle`, and `category`.
2. **Category Auto-Detection:** Automatically infers whether a row represents travel, electricity, or diet based on lexical keywords (`petrol`, `flight`, `diesel`, `solar`, `kwh`, `beef`, `commute`).
3. **Data Sanitization:** Strips currency symbols, cleans commas, handles empty rows, and protects against malformed CSV injection attacks.

---

## **9. RESTful API Specifications**

### **9.1 Authentication Endpoints (`/api/auth`)**
* `POST /api/auth/register`: Register new organizational or individual user.
* `POST /api/auth/login`: Authenticate credentials, issue stateless JWT token containing `id` and `role`.
* `GET /api/auth/sync-credentials`: Idempotent security endpoint ensuring default administrator and verified user accounts are provisioned with correct roles.
* `GET /api/auth/me`: Retrieve currently logged-in user profile with role permissions (Protected via Bearer Token).
* `PUT /api/auth/profile`: Update user profile details and organizational affiliation.
* `PUT /api/auth/apply-provider`: Submit provider accreditation application with verification documents.

### **9.2 Carbon Activity Telemetry Endpoints (`/api/activities`)**
* `POST /api/activities`: Log single activity record with automatic $CO_2e$ computation.
* `GET /api/activities`: Retrieve paginated history of user emission activities with category filters.
* `GET /api/activities/summary`: Aggregate total emissions, category-wise percentage distribution, and historical monthly trajectories.
* `DELETE /api/activities/:id`: Remove erroneous activity record and re-aggregate user metrics.

### **9.3 Batch File Processing Endpoints (`/api/upload`)**
* `POST /api/upload/analyze-carbon`: Ingest and analyze CSV/text data files in-memory; returns immediate carbon audit without forced database pollution.
* `GET /api/upload/template`: Download standardized CSV template for bulk organizational reporting.

### **9.4 Eco-Quest Challenge Endpoints (`/api/challenges`)**
* `GET /api/challenges`: Fetch active campus and regional sustainability challenges.
* `POST /api/challenges/:id/join`: Enroll user into active quest challenge.
* `GET /api/challenges/leaderboard`: Real-time aggregated peer leaderboard ranking top sustainability champions by points and badges.

### **9.5 Carbon Offset Marketplace Endpoints (`/api/offsets`)**
* `GET /api/offsets/listings`: Retrieve verified carbon offset projects (afforestation, solar, methane capture).
* `POST /api/offsets/purchase`: Process offset retirement order, deduct available units, issue unique cryptographic `certificateId`.
* `GET /api/offsets/my-offsets`: Fetch user's certificate portfolio and retired emission kilograms.

### **9.6 Administrator Governance Endpoints (`/api/admin`)**
* `GET /api/admin/stats`: High-level executive KPIs (total platform users, total $CO_2$ tracked, total offsets retired, active challenges).
* `GET /api/admin/users`: Enumerate all registered users with role switching and deactivation capabilities.
* `PUT /api/admin/verify-provider/:id`: Approve or reject carbon offset provider applications.

---

## **10. User Interface Design & Experience Architecture**

The user interface of CarbonTrack™ has been engineered with a **Classical Obsidian-Forest Aesthetic**, utilizing high-contrast typography, emerald highlights, and dark-mode glassmorphism to convey prestige, environmental seriousness, and computational authority.

```mermaid
flowchart LR
    subgraph NavigationArchitecture["Application Page Flow"]
        Home["/ Home Landing Page"]
        Login["/login Classical Dual Portal"]
        Register["/register User Onboarding"]
        Dash["/dashboard Real-Time Telemetry"]
        Analytics["/analytics Historical Analytics"]
        Upload["FileUploadModal Batch Processor"]
        Challenges["/challenges Quests & Leaderboard"]
        Market["/marketplace Offset Marketplace"]
        Admin["/admin Governance Console"]
        
        Home --> Login
        Home --> Register
        Login -->|User Role| Dash
        Login -->|Admin Role| Admin
        Dash --> Analytics
        Dash --> Upload
        Dash --> Challenges
        Dash --> Market
    end
```

### **10.1 Key UI Views & Highlights**
1. **Classical Login Portal (`/login`):**
   * Eliminates exposed plain-text credentials and promotional noise.
   * Features an institutional left-hand showcase detailing compliance with ISO 14064 climate protocols.
   * Dual-portal segmented pill controls facilitating seamless switching between **User Portal** and **Administrator Console**.
2. **Interactive Telemetry Dashboard (`/dashboard`):**
   * Metric Stat Cards displaying Net $CO_2$ emitted, Total Offsets, Quest Points, and Active Streaks.
   * Activity Logging Modal with real-time dynamic factor updates as the user alters vehicles or power types.
   * Quick-launch button for the **File Ingestion Modal**.
3. **Advanced Analytics Hub (`/analytics`):**
   * Recharts Donut Chart breaking down emissions by scope (Transport, Energy, Food, Waste, Digital).
   * Time-series Area Chart tracking monthly carbon footprint trends versus offset mitigations.
4. **Campus Leaderboard & Quests (`/challenges`):**
   * Visual progress bars for active challenges.
   * Real-time leaderboard table showcasing campus champions (including Divakar Pandey, LPU students, and regional cohorts).

---

## **11. Security, Authentication & Authorization Architecture**

### **11.1 Cryptographic Storage of Credentials**
Passwords are never stored in plaintext. In `backend/models/User.js`, a Mongoose `pre-save` hook automatically intercepts modified passwords, generating a cryptographically secure salt via `bcrypt.genSalt(10)` and computing the resulting hash.

```javascript
// Pre-save hashing logic in User.js
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
```

### **11.2 Stateless JSON Web Tokens (JWT)**
Upon successful password verification via `bcrypt.compare()`, the authentication controller issues a signed JWT token encapsulating the user's primary identity and role:

```javascript
// Token generation utility in generateToken.js
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
```

### **11.3 Multi-Layer Route Protection Middleware**
* **`protect` Middleware:** Intercepts incoming requests, extracts the `Bearer <token>` from the HTTP `Authorization` header, verifies the signature against `JWT_SECRET`, decodes the payload, and attaches the sanitized `req.user` object.
* **`authorize("admin")` Middleware:** Inspects the authenticated user's role. If `req.user.role !== "admin"`, the server immediately halts execution with an HTTP 403 Forbidden response.

---

## **12. Testing, Validation & Quality Assurance**

### **12.1 Unit & Functional Testing Matrix**

| Test Case ID | Target Module | Test Scenario Description | Input Data | Expected Output | Actual Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-AUTH-01** | `authController` | Administrator sign-in with valid credentials | `pandeydivakar07@gmail.com` / `Bairagi@101` | HTTP 200 + JWT Token + role: "admin" | **PASSED** |
| **TC-AUTH-02** | `authController` | User sign-in with valid credentials | `pandeydivakar1080@gmail.com` / `Bairagi@101` | HTTP 200 + JWT Token + role: "user" | **PASSED** |
| **TC-AUTH-03** | `authController` | Role enforcement on Admin tab | User credentials entered in Admin Portal | Access Denied: User role blocked from Admin console | **PASSED** |
| **TC-AUTH-04** | `authController` | Invalid password attempt | Correct email + wrong password | HTTP 401: Invalid email or password | **PASSED** |
| **TC-EMIS-01** | `emissionFactors` | Petrol car transport computation | Category: `transport`, SubType: `car_petrol`, Qty: `100 km` | $100 \times 0.192 = 19.20\ kg\ CO_2e$ | **PASSED** |
| **TC-EMIS-02** | `emissionFactors` | Solar electricity consumption | Category: `electricity`, SubType: `solar`, Qty: `500 kWh` | $500 \times 0.000 = 0.00\ kg\ CO_2e$ | **PASSED** |
| **TC-FILE-01** | `uploadController`| Tabular CSV parsing & calculation | Multi-row CSV file with transport and bills | HTTP 200 + JSON breakdown + CO2 total | **PASSED** |
| **TC-CHAL-01** | `challengeController`| Real-time Leaderboard Aggregation | Fetch `/api/challenges/leaderboard` | Top participants sorted by score descending | **PASSED** |
| **TC-OFFS-01** | `offsetController` | Offset purchase & credit retirement | Purchase 2 tons afforestation credit | Unique `certificateId` generated + stock decremented | **PASSED** |

---

## **13. Deployment, Infrastructure & CI/CD Pipeline**

The project utilizes automated Continuous Integration and Continuous Deployment (CI/CD) pipelines connected directly to the primary GitHub repository.

```mermaid
flowchart LR
    Dev["Developer (Local Machine)"] -->|git push origin main| GitHub["GitHub Repository (main branch)"]
    
    subgraph VercelCI["Vercel Cloud Platform"]
        GitHub -->|Webhook Trigger| VercelBuild["Vercel Build Environment"]
        VercelBuild -->|react-scripts build| StaticOptim["Production Bundle Optimization (SPA)"]
        StaticOptim -->|Deploy to Edge CDN| VercelProd["https://carbon-tracker-olive.vercel.app"]
    end

    subgraph RenderCI["Render Cloud Platform"]
        GitHub -->|Webhook Trigger| RenderBuild["Render Web Service (Linux Container)"]
        RenderBuild -->|npm install && npm start| NodeBackend["Node.js / Express Server Process"]
        NodeBackend -->|TLS Connection| AtlasCluster[("MongoDB Atlas Cloud (Cluster0)")]
        NodeBackend -->|Expose Port 443| RenderProd["https://carbontracker-jr2i.onrender.com"]
    end
```

### **13.1 Production Environment Variables**
* **Frontend (`frontend/.env`):**
  * `REACT_APP_API_URL=https://carbontracker-jr2i.onrender.com/api`
* **Backend (`backend/.env`):**
  * `PORT=5000`
  * `MONGO_URI=mongodb://pandeydivakar07:...@ac-wzleqeb-shard-00-00.aucyx06.mongodb.net:27017.../carbon-tracker?ssl=true...`
  * `JWT_SECRET=super_secret_jwt_key_carbontrack_2026`
  * `FRONTEND_URL=https://carbon-tracker-olive.vercel.app`

---

## **14. Conclusion & Future Roadmap**

### **14.1 Project Conclusion**
**CarbonTrack™** successfully addresses the challenge of accessible, real-time, and verifiable greenhouse gas telemetry. By pairing algorithmic emission calculation across 7 core activity domains with a specialized batch file processing engine, the platform eliminates the friction of traditional data entry. Furthermore, the integration of accredited offset credit retirement and social gamification mechanics provides a comprehensive solution for university campuses, corporate enterprises, and eco-conscious citizens.

The complete software suite has been built, tested, and deployed to live production cloud infrastructure, adhering to modern software engineering standards, clean architecture principles, and rigorous academic specifications.

### **14.2 Future Roadmap & Enhancements**
* **IoT Smart Meter Integration:** Direct MQTT/REST webhook ingestion from campus smart electrical meters and smart building automation systems.
* **Computer Vision Invoice OCR:** Expanding the file upload module to include Tesseract/Google Vision OCR for scanning paper electricity and utility bills directly from smartphone photos.
* **Blockchain-Verified Offset Certificates:** Minting non-fungible proof-of-retirement tokens (ERC-721 or Polygon) to provide immutable proof against double-counting of carbon credits.
* **Mobile Application:** Compiling a native cross-platform mobile app using React Native to enable automated background transit detection via GPS telemetry.

---

### **Student & Project Acknowledgments**
* **Developed By:** Divakar Pandey (Lovely Professional University)
* **Master of Computer Applications (MCA) Capstone Project**
* **Platform Repositories:** [GitHub Source Code](https://github.com/divakarpandey07/Carbon-Tracker) | [Live Application](https://carbon-tracker-olive.vercel.app)
