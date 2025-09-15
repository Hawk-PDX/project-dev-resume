#!/bin/bash

# Backend connectivity test script
BACKEND_URL="https://portfolio-backend-skva.onrender.com"

echo "🚀 Backend Connectivity Test"
echo "   Testing backend at: $BACKEND_URL"
echo "=================================================="

echo ""
echo "🔍 Testing basic connectivity..."
response=$(curl -s -w "\nHTTP_CODE:%{http_code}\nTIME:%{time_total}" "$BACKEND_URL")
http_code=$(echo "$response" | grep "HTTP_CODE:" | cut -d: -f2)
time_total=$(echo "$response" | grep "TIME:" | cut -d: -f2)
content=$(echo "$response" | grep -v "HTTP_CODE:\|TIME:")

echo "   Status Code: $http_code"
echo "   Response Time: ${time_total}s"

if [ "$http_code" = "200" ]; then
    echo "   ✅ Basic connectivity works!"
    basic_works=true
elif [ "$http_code" = "502" ]; then
    echo "   ❌ 502 Bad Gateway - Service likely not running"
    basic_works=false
else
    echo "   ⚠️  Unexpected status code: $http_code"
    basic_works=false
fi

# If basic connectivity fails, try to wake up the service
if [ "$basic_works" = false ]; then
    echo ""
    echo "💤 Service appears to be sleeping. Attempting to wake it up..."
    
    for i in {1..3}; do
        echo "   Attempt $i/3..."
        response=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$BACKEND_URL")
        http_code=$(echo "$response" | grep "HTTP_CODE:" | cut -d: -f2)
        
        if [ "$http_code" = "200" ] || [ "$http_code" = "404" ]; then
            echo "   ✅ Service appears to be awake!"
            basic_works=true
            break
        elif [ "$http_code" = "502" ]; then
            echo "   💤 Service still sleeping, waiting..."
            sleep 10
        else
            echo "   ⚠️  Unexpected response: $http_code"
            sleep 5
        fi
    done
    
    if [ "$basic_works" = false ]; then
        echo "   ❌ Could not wake up the service"
        echo ""
        echo "🔧 Troubleshooting steps:"
        echo "   1. Check your Render dashboard at https://dashboard.render.com"
        echo "   2. Verify the service is deployed and not crashed"
        echo "   3. Check the service logs for errors"
        echo "   4. Ensure environment variables are set correctly"
        echo "   5. Make sure your GitHub repository is connected and up to date"
        exit 1
    fi
fi

echo ""
echo "🔍 Testing API root endpoint..."
response=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$BACKEND_URL/api")
http_code=$(echo "$response" | grep "HTTP_CODE:" | cut -d: -f2)
content=$(echo "$response" | grep -v "HTTP_CODE:")

echo "   Status Code: $http_code"
if [ "$http_code" = "200" ]; then
    echo "   Response: $content"
    echo "   ✅ API root endpoint works!"
else
    echo "   ❌ API root failed with status $http_code"
    if [ -n "$content" ]; then
        echo "   Response: ${content:0:200}"
    fi
fi

echo ""
echo "🔍 Testing health endpoint..."
response=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$BACKEND_URL/api/health")
http_code=$(echo "$response" | grep "HTTP_CODE:" | cut -d: -f2)
content=$(echo "$response" | grep -v "HTTP_CODE:")

echo "   Status Code: $http_code"
if [ "$http_code" = "200" ]; then
    echo "   Response: $content"
    echo "   ✅ Health endpoint works!"
else
    echo "   ❌ Health check failed with status $http_code"
    if [ -n "$content" ]; then
        echo "   Response: ${content:0:200}"
    fi
fi

echo ""
echo "=================================================="
echo "✅ Backend testing complete!"

# Additional diagnostic information
echo ""
echo "🔧 Diagnostic Information:"
echo "   Backend URL: $BACKEND_URL"
echo "   Expected Database: PostgreSQL on Render"
echo "   Frontend should connect to: $BACKEND_URL/api"