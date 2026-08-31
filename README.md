Raritone — Frontend

Raritone is a MERN-based e-commerce frontend with AI-powered virtual try-on and interactive 3D product viewing.

Features
E-Commerce
Product listing
Product details
Product search and browsing
Shopping cart
Wishlist
User authentication
Order management
Virtual Try-On

The frontend integrates with the Raritone backend for AI-powered virtual try-on.

The frontend sends the selected product ID and user image to the backend. The backend handles communication with the AI VTON service.

The frontend displays the processing status and final try-on result.

3D Product Viewer

Raritone supports interactive 3D product models using React Three Fiber and Three.js.

The 3D flow is:

React Product Page
        ↓
GET /api/products/:productId/3d
        ↓
Raritone Backend
        ↓
Approved 3D Asset URL
        ↓
ThreeDViewer
        ↓
Interactive GLB Model

The frontend does not hard-code individual .glb files. Each product retrieves its approved 3D asset dynamically from the backend.

The viewer supports:

GLB loading
Rotate
Zoom
Pan
Reset
Fullscreen
Loading indicator
Error handling

If a product does not have an approved 3D model, the frontend displays:

3D preview coming soon.

If the model cannot be loaded, the viewer handles the error without crashing the product page.

Admin 3D Asset Review

The frontend provides an admin dashboard at:

/admin/3d-assets

Administrators can review uploaded 3D assets and view:

Product information
3D preview
Format
Polygon count
File size
Model version
Source
License
Asset status

Pending assets can be:

APPROVE
REJECT

Rejected assets require a rejection reason.

3D Asset Status

The frontend works with the following asset states:

PENDING_REVIEW
      ↓
   APPROVED

or:

PENDING_REVIEW
      ↓
   REJECTED

Only approved assets are displayed to customers.

Project Structure
frontend/
│
├── src/
│   │
│   ├── components/
│   │   ├── ThreeDViewer.jsx
│   │   ├── AssetUpload.jsx
│   │   └── AssetStatus.jsx
│   │
│   ├── pages/
│   │   ├── Product.jsx
│   │   └── Admin3DAssets.jsx
│   │
│   ├── services/
│   │   └── threeDAssetService.js
│   │
│   ├── context/
│   │
│   ├── components/
│   │
│   └── App.jsx
│
├── package.json
└── README.md
Installation

Clone the frontend repository and install dependencies:

npm install
Environment Variables

Create a .env file and configure the backend API URL.

Example:

VITE_API_URL=http://localhost:3000/api

For production, use the deployed backend URL.

Do not store API secrets or private credentials in the frontend.

Running the Frontend

Start the development server:

npm run dev

The application will be available at:

http://localhost:5173
Production Build

Create a production build:

npm run build

Preview the production build:

npm run preview
AI/ML 3D Integration

The AI/ML team generates or prepares 3D assets using their AI pipeline, including Kaggle GPU infrastructure when required.

The expected asset can contain:

RAR-3D-001/
├── model.glb
├── thumbnail.png
├── metadata.json
└── evaluation.json

The frontend does not directly depend on Kaggle or the AI/ML generation process.

Once the asset is uploaded and approved by the backend, the frontend automatically retrieves the asset URL through the product 3D API.

Therefore, replacing a sample GLB with a real AI/ML-generated GLB does not require changes to the React 3D viewer.

End-to-End 3D Flow
AI/ML / Kaggle
      ↓
model.glb
      ↓
Raritone Backend
      ↓
Storage
      ↓
MongoDB Metadata
      ↓
Admin Review
      ↓
APPROVED
      ↓
Product Page
      ↓
GET /api/products/:productId/3d
      ↓
ThreeDViewer
      ↓
Rotate / Zoom / Pan / Reset / Fullscreen
Error Handling

The frontend handles 3D asset states without breaking the product page.

Loading
→ Loading 3D model...

No approved model
→ 3D preview coming soon.

Invalid/unavailable model
→ 3D preview unavailable.

Network failure
→ Couldn't load the 3D model. Please try again.
Deployment

The Raritone frontend is maintained in a separate GitHub repository from the backend.

The production frontend communicates with the deployed Raritone Express backend through the configured API URL.

Vercel
Frontend
   ↓
Render
Backend
   ↓
MongoDB + ImageKit + AI Services
Final Status

The frontend includes the complete customer and admin-side 3D workflow:

3D Asset
   ↓
Backend API
   ↓
Admin Approval
   ↓
Approved Asset
   ↓
Product Page
   ↓
Interactive Three.js Viewer
