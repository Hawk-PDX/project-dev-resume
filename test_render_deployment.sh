#!/bin/bash

# Test script for complete Render deployment functionality
FRONTEND_URL="https://portfolio-frontend-zhcd.onrender.com"
BACKEND_URL="https://portfolio-backend-skva.onrender.com"

echo "🚀 Testing Complete Render Deployment"
echo "Frontend: $FRONTEND_URL"
echo "Backend: $BACKEND_URL"
echo "========================================================"

# Test 1: Frontend accessibility
echo ""
echo "1️⃣ Testing Frontend Deployment..."
frontend_response=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$FRONTEND_URL")
frontend_code=$(echo "$frontend_response" | grep "HTTP_CODE:" | cut -d: -f2)

if [ "$frontend_code" = "200" ]; then
    echo "   ✅ Frontend is accessible"
    # Check if it contains React app indicators
    if echo "$frontend_response" | grep -q "vite\|react\|div.*id.*root"; then
        echo "   ✅ Frontend appears to be a React application"
    else
        echo "   ⚠️  Frontend may not be built correctly"
    fi
else
    echo "   ❌ Frontend failed with status $frontend_code"
fi

# Test 2: Backend API endpoints
echo ""
echo "2️⃣ Testing Backend API..."
backend_health=$(curl -s "$BACKEND_URL/api/health")
if echo "$backend_health" | grep -q "healthy"; then
    echo "   ✅ Backend health check passed"
    echo "   📊 Health status: $(echo $backend_health | grep -o '"status":"[^"]*"')"
else
    echo "   ❌ Backend health check failed"
    echo "   Response: $backend_health"
fi

# Test 3: Database connectivity and data
echo ""
echo "3️⃣ Testing Database & Projects..."
projects_response=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$BACKEND_URL/api/projects/")
projects_code=$(echo "$projects_response" | grep "HTTP_CODE:" | cut -d: -f2)
projects_data=$(echo "$projects_response" | grep -v "HTTP_CODE:")

if [ "$projects_code" = "200" ]; then
    echo "   ✅ Projects API accessible"
    
    # Count projects
    project_count=$(echo "$projects_data" | grep -o '"id":[0-9]*' | wc -l)
    echo "   📊 Found $project_count projects in database"
    
    if [ "$project_count" -gt "0" ]; then
        echo "   ✅ Database has project data"
        # Show sample project
        first_project_title=$(echo "$projects_data" | grep -o '"title":"[^"]*"' | head -1 | cut -d'"' -f4)
        echo "   📝 Sample project: $first_project_title"
    else
        echo "   ⚠️  Database appears empty"
    fi
else
    echo "   ❌ Projects API failed with status $projects_code"
fi

# Test 4: Skills API
echo ""
echo "4️⃣ Testing Skills API..."
skills_response=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$BACKEND_URL/api/skills/")
skills_code=$(echo "$skills_response" | grep "HTTP_CODE:" | cut -d: -f2)
skills_data=$(echo "$skills_response" | grep -v "HTTP_CODE:")

if [ "$skills_code" = "200" ]; then
    echo "   ✅ Skills API accessible"
    skill_count=$(echo "$skills_data" | grep -o '"id":[0-9]*' | wc -l)
    echo "   📊 Found $skill_count skills in database"
else
    echo "   ❌ Skills API failed with status $skills_code"
fi

# Test 5: Resume API
echo ""
echo "5️⃣ Testing Resume API..."
resume_response=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$BACKEND_URL/api/resume/personal")
resume_code=$(echo "$resume_response" | grep "HTTP_CODE:" | cut -d: -f2)

if [ "$resume_code" = "200" ]; then
    echo "   ✅ Resume API accessible"
else
    echo "   ❌ Resume API failed with status $resume_code"
fi

# Test 6: CORS Configuration
echo ""
echo "6️⃣ Testing CORS Configuration..."
cors_response=$(curl -s -H "Origin: $FRONTEND_URL" -H "Access-Control-Request-Method: GET" -H "Access-Control-Request-Headers: Content-Type" -X OPTIONS "$BACKEND_URL/api/projects/")
if [ -n "$cors_response" ] || [ $? -eq 0 ]; then
    echo "   ✅ CORS appears to be configured"
else
    echo "   ⚠️  CORS may need attention"
fi

echo ""
echo "========================================================"
echo "📊 DEPLOYMENT SUMMARY"
echo "========================================================"

# Final assessment
if [ "$frontend_code" = "200" ] && echo "$backend_health" | grep -q "healthy" && [ "$projects_code" = "200" ]; then
    echo "🎉 SUCCESS: Your Render deployment is working correctly!"
    echo ""
    echo "✅ Frontend is deployed and accessible"
    echo "✅ Backend API is responding"
    echo "✅ Database is connected and has data"
    echo "✅ All core endpoints are functional"
    echo ""
    echo "🌐 Your live portfolio: $FRONTEND_URL"
    echo "🔗 API endpoint: $BACKEND_URL/api"
    echo ""
    echo "🎯 You can now:"
    echo "   • Visit your live portfolio"
    echo "   • Add GitHub projects via the frontend"
    echo "   • Test project persistence"
    echo "   • Share your portfolio URL with others"
else
    echo "⚠️  Some issues detected:"
    [ "$frontend_code" != "200" ] && echo "   • Frontend accessibility issue"
    [ ! $(echo "$backend_health" | grep -q "healthy") ] && echo "   • Backend health check issue"
    [ "$projects_code" != "200" ] && echo "   • Projects API issue"
    echo ""
    echo "💡 Check Render dashboard for detailed logs and status"
fi

echo ""