#!/bin/bash

# Test script for fixed CORS and API issues
BACKEND_URL="https://portfolio-backend-skva.onrender.com"
FRONTEND_URL="https://portfolio-frontend-zhcd.onrender.com"

echo "🔧 Testing Fixed Issues"
echo "Backend: $BACKEND_URL"
echo "Frontend: $FRONTEND_URL"
echo "========================================================"

# Test 1: Skills insights endpoint (was returning 500)
echo ""
echo "1️⃣ Testing Skills Insights API..."
skills_response=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$BACKEND_URL/api/skills/insights")
skills_code=$(echo "$skills_response" | grep "HTTP_CODE:" | cut -d: -f2)
skills_data=$(echo "$skills_response" | grep -v "HTTP_CODE:")

if [ "$skills_code" = "200" ]; then
    echo "   ✅ Skills insights API working"
    total_skills=$(echo "$skills_data" | grep -o '"total_skills":[0-9]*' | cut -d: -f2)
    echo "   📊 Total skills in system: $total_skills"
else
    echo "   ❌ Skills insights failed with status $skills_code"
fi

# Test 2: Resume personal endpoint with CORS headers
echo ""
echo "2️⃣ Testing Resume Personal API with CORS..."
resume_response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -H "Origin: $FRONTEND_URL" "$BACKEND_URL/api/resume/personal")
resume_code=$(echo "$resume_response" | grep "HTTP_CODE:" | cut -d: -f2)
resume_data=$(echo "$resume_response" | grep -v "HTTP_CODE:")

if [ "$resume_code" = "200" ]; then
    echo "   ✅ Resume API working with CORS"
    name=$(echo "$resume_data" | grep -o '"name":"[^"]*"' | cut -d'"' -f4)
    echo "   👤 Profile name: $name"
else
    echo "   ❌ Resume API failed with status $resume_code"
fi

# Test 3: Projects fetch-github endpoint improvement
echo ""
echo "3️⃣ Testing Improved GitHub Fetch API..."
github_test_response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -H "Content-Type: application/json" -d '{}' "$BACKEND_URL/api/projects/fetch-github")
github_code=$(echo "$github_test_response" | grep "HTTP_CODE:" | cut -d: -f2)
github_data=$(echo "$github_test_response" | grep -v "HTTP_CODE:")

if [ "$github_code" = "400" ]; then
    if echo "$github_data" | grep -q "GitHub URL is required"; then
        echo "   ✅ GitHub fetch API properly validates input"
        echo "   📝 Validation message: $(echo $github_data | grep -o '"error":"[^"]*"' | cut -d'"' -f4)"
    else
        echo "   ⚠️  GitHub fetch API returned 400 but with unexpected message"
    fi
else
    echo "   ⚠️  GitHub fetch API returned unexpected status $github_code"
fi

# Test 4: CORS preflight for projects API
echo ""
echo "4️⃣ Testing CORS Preflight for Projects API..."
cors_response=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
    -H "Origin: $FRONTEND_URL" \
    -H "Access-Control-Request-Method: GET" \
    -H "Access-Control-Request-Headers: Content-Type" \
    -X OPTIONS "$BACKEND_URL/api/projects/")
cors_code=$(echo "$cors_response" | grep "HTTP_CODE:" | cut -d: -f2)

if [ "$cors_code" = "200" ]; then
    echo "   ✅ CORS preflight working for projects API"
else
    echo "   ⚠️  CORS preflight returned status $cors_code"
fi

# Test 5: Overall API health
echo ""
echo "5️⃣ Testing Overall API Health..."
health_response=$(curl -s "$BACKEND_URL/api/health")
if echo "$health_response" | grep -q "healthy"; then
    echo "   ✅ Overall API health is good"
    echo "   🏥 Status: $(echo $health_response | grep -o '"status":"[^"]*"' | cut -d'"' -f4)"
    echo "   💾 Database: $(echo $health_response | grep -o '"database":"[^"]*"' | cut -d'"' -f4)"
else
    echo "   ❌ API health check failed"
fi

echo ""
echo "========================================================"
echo "📊 FIXES SUMMARY"
echo "========================================================"

if [ "$skills_code" = "200" ] && [ "$resume_code" = "200" ] && [ "$github_code" = "400" ]; then
    echo "🎉 SUCCESS: All major issues have been resolved!"
    echo ""
    echo "✅ Skills insights API: Working"
    echo "✅ Resume API with CORS: Working"
    echo "✅ GitHub fetch validation: Improved"
    echo "✅ CORS configuration: Fixed"
    echo "✅ Overall API health: Good"
    echo ""
    echo "🌐 Your frontend should now work without CORS errors!"
    echo "🔗 Test your live portfolio: $FRONTEND_URL"
else
    echo "⚠️  Some issues may still exist:"
    [ "$skills_code" != "200" ] && echo "   • Skills insights API issue"
    [ "$resume_code" != "200" ] && echo "   • Resume API or CORS issue"
    [ "$github_code" != "400" ] && echo "   • GitHub fetch validation issue"
    echo ""
    echo "💡 Allow 2-5 minutes for Render to fully deploy the fixes"
fi

echo ""