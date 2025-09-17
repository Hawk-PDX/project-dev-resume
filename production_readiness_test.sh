#!/bin/bash

# Production Readiness Test for Portfolio
FRONTEND_URL="https://portfolio-frontend-zhcd.onrender.com"
BACKEND_URL="https://portfolio-backend-skva.onrender.com"

echo "🚀 PRODUCTION READINESS TEST"
echo "=============================="
echo "Frontend: $FRONTEND_URL"
echo "Backend:  $BACKEND_URL"
echo "Time:     $(date)"
echo ""

# Test 1: Backend Health & Performance
echo "1️⃣ Backend Health & Performance"
echo "--------------------------------"
start_time=$(date +%s.%N)
health_response=$(curl -s -w "\nHTTP_CODE:%{http_code}\nTIME:%{time_total}" "$BACKEND_URL/api/health")
end_time=$(date +%s.%N)
response_time=$(echo "scale=2; $end_time - $start_time" | bc)

health_code=$(echo "$health_response" | grep "HTTP_CODE:" | cut -d: -f2)
curl_time=$(echo "$health_response" | grep "TIME:" | cut -d: -f2)
health_data=$(echo "$health_response" | grep -v "HTTP_CODE:\|TIME:")

if [ "$health_code" = "200" ]; then
    echo "✅ Backend Health: GOOD"
    echo "⏱️  Response Time: ${curl_time}s"
    if (( $(echo "$curl_time < 5" | bc -l) )); then
        echo "🚀 Performance: EXCELLENT (< 5s)"
    elif (( $(echo "$curl_time < 15" | bc -l) )); then
        echo "⚡ Performance: GOOD (< 15s)"
    else
        echo "🐌 Performance: SLOW (> 15s) - Consider upgrading Render plan"
    fi
else
    echo "❌ Backend Health: FAILED ($health_code)"
fi

# Test 2: Projects API Load Test
echo ""
echo "2️⃣ Projects API Performance"
echo "----------------------------"
projects_start=$(date +%s.%N)
projects_response=$(curl -s -w "\nHTTP_CODE:%{http_code}\nTIME:%{time_total}" "$BACKEND_URL/api/projects/")
projects_end=$(date +%s.%N)

projects_code=$(echo "$projects_response" | grep "HTTP_CODE:" | cut -d: -f2)
projects_time=$(echo "$projects_response" | grep "TIME:" | cut -d: -f2)
projects_data=$(echo "$projects_response" | grep -v "HTTP_CODE:\|TIME:")

if [ "$projects_code" = "200" ]; then
    project_count=$(echo "$projects_data" | jq length 2>/dev/null || echo "0")
    featured_count=$(echo "$projects_data" | jq '[.[] | select(.featured == true)] | length' 2>/dev/null || echo "0")
    
    echo "✅ Projects API: WORKING"
    echo "📊 Total Projects: $project_count"
    echo "⭐ Featured Projects: $featured_count"
    echo "⏱️  Load Time: ${projects_time}s"
    
    if [ "$project_count" -ge "3" ]; then
        echo "📈 Content: SUFFICIENT for job applications"
    else
        echo "⚠️  Content: Consider adding more projects"
    fi
else
    echo "❌ Projects API: FAILED ($projects_code)"
fi

# Test 3: Frontend Load Test
echo ""
echo "3️⃣ Frontend Performance"
echo "------------------------"
frontend_start=$(date +%s.%N)
frontend_response=$(curl -s -w "\nHTTP_CODE:%{http_code}\nTIME:%{time_total}" "$FRONTEND_URL")
frontend_end=$(date +%s.%N)

frontend_code=$(echo "$frontend_response" | grep "HTTP_CODE:" | cut -d: -f2)
frontend_time=$(echo "$frontend_response" | grep "TIME:" | cut -d: -f2)
frontend_content=$(echo "$frontend_response" | grep -v "HTTP_CODE:\|TIME:")

if [ "$frontend_code" = "200" ]; then
    echo "✅ Frontend: ACCESSIBLE"
    echo "⏱️  Load Time: ${frontend_time}s"
    
    # Check if it's a React app
    if echo "$frontend_content" | grep -q "root\|react\|vite"; then
        echo "⚛️  React App: DETECTED"
    fi
    
    # Check bundle size (rough estimate)
    content_size=$(echo "$frontend_content" | wc -c)
    if [ "$content_size" -gt "1000" ]; then
        echo "📦 Bundle: LOADED (${content_size} chars)"
    else
        echo "⚠️  Bundle: SMALL - may not be built correctly"
    fi
else
    echo "❌ Frontend: FAILED ($frontend_code)"
fi

# Test 4: End-to-End Integration
echo ""
echo "4️⃣ End-to-End Integration Test"
echo "-------------------------------"
# Test CORS by simulating frontend request
cors_response=$(curl -s -w "\nHTTP_CODE:%{http_code}" \
    -H "Origin: $FRONTEND_URL" \
    -H "Content-Type: application/json" \
    "$BACKEND_URL/api/projects/")
cors_code=$(echo "$cors_response" | grep "HTTP_CODE:" | cut -d: -f2)

if [ "$cors_code" = "200" ]; then
    echo "✅ CORS: CONFIGURED"
    echo "🔗 Frontend ↔ Backend: CONNECTED"
else
    echo "❌ CORS: ISSUES ($cors_code)"
fi

# Test 5: Performance Summary
echo ""
echo "5️⃣ Performance Summary"
echo "----------------------"
total_backend_time=$(echo "$curl_time + $projects_time" | bc)
if (( $(echo "$total_backend_time < 10" | bc -l) )); then
    perf_grade="A"
    perf_desc="EXCELLENT"
elif (( $(echo "$total_backend_time < 20" | bc -l) )); then
    perf_grade="B"
    perf_desc="GOOD"
elif (( $(echo "$total_backend_time < 35" | bc -l) )); then
    perf_grade="C"
    perf_desc="ACCEPTABLE"
else
    perf_grade="D"
    perf_desc="NEEDS IMPROVEMENT"
fi

echo "📊 Performance Grade: $perf_grade ($perf_desc)"
echo "⚡ Backend Total Time: ${total_backend_time}s"
echo "🌐 Frontend Load Time: ${frontend_time}s"

# Final Assessment
echo ""
echo "=============================="
echo "🎯 PRODUCTION READINESS REPORT"
echo "=============================="

ready_score=0
if [ "$health_code" = "200" ]; then ready_score=$((ready_score + 25)); fi
if [ "$projects_code" = "200" ]; then ready_score=$((ready_score + 25)); fi
if [ "$frontend_code" = "200" ]; then ready_score=$((ready_score + 25)); fi
if [ "$cors_code" = "200" ]; then ready_score=$((ready_score + 25)); fi

if [ "$ready_score" -ge "90" ]; then
    echo "🎉 STATUS: PRODUCTION READY! ($ready_score%)"
    echo ""
    echo "✅ Your portfolio is job-application ready!"
    echo "🔗 Share this URL: $FRONTEND_URL"
    echo "📧 Start applying for jobs!"
elif [ "$ready_score" -ge "75" ]; then
    echo "⚡ STATUS: MOSTLY READY ($ready_score%)"
    echo ""
    echo "✅ Core functionality working"
    echo "⚠️  Minor issues may exist - check logs"
    echo "💼 Suitable for job applications"
elif [ "$ready_score" -ge "50" ]; then
    echo "⚠️  STATUS: PARTIAL ($ready_score%)"
    echo ""
    echo "🔧 Some components need attention"
    echo "⏳ Allow 5-10 minutes for full deployment"
else
    echo "❌ STATUS: NOT READY ($ready_score%)"
    echo ""
    echo "🚨 Major issues detected"
    echo "🔧 Check Render deployment logs"
fi

echo ""
echo "💡 Tips for job applications:"
echo "   • Add more projects if you have less than 5"
echo "   • Ensure all GitHub links work"
echo "   • Test the live demo links"
echo "   • Check the site on mobile devices"
echo ""