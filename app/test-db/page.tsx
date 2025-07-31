"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Database, Users, Settings, Loader2 } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'loading';
  message: string;
  details?: any;
}

export default function DatabaseTest() {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    setTests([]);

    const testResults: TestResult[] = [];

    // Test 1: Database Connection
    try {
      setTests([{ name: 'SQLite Connection', status: 'loading', message: 'Testing connection...' }]);
      
      const response = await fetch('/api/test/connection');
      const result = await response.json();
      
      if (response.ok && result.success) {
        testResults.push({
          name: 'SQLite Connection',
          status: 'success',
          message: 'Successfully connected to SQLite database'
        });
      } else {
        testResults.push({
          name: 'SQLite Connection',
          status: 'error',
          message: `Connection failed: ${result.message}`,
          details: result.error
        });
      }
    } catch (error: any) {
      testResults.push({
        name: 'SQLite Connection',
        status: 'error',
        message: `Connection error: ${error.message}`,
        details: error
      });
    }

    setTests([...testResults]);

    // Test 2: Table Structure
    try {
      setTests(prev => [...prev, { name: 'Table Structure', status: 'loading', message: 'Checking tables...' }]);

      const response = await fetch('/api/test/tables');
      const result = await response.json();

      if (response.ok && result.success) {
        testResults.push({
          name: 'Table Structure',
          status: 'success',
          message: `Found ${result.tables.length} tables`,
          details: result.tables
        });
      } else {
        testResults.push({
          name: 'Table Structure',
          status: 'error',
          message: `Table check failed: ${result.message}`,
          details: result.error
        });
      }
    } catch (error: any) {
      testResults.push({
        name: 'Table Structure',
        status: 'error',
        message: `Table check failed: ${error.message}`
      });
    }

    setTests([...testResults]);

    // Test 3: Authentication System
    try {
      setTests(prev => [...prev, { name: 'Authentication', status: 'loading', message: 'Testing auth system...' }]);

      // Test signup
      const testEmail = `test_${Date.now()}@example.com`;
      const signupResponse = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: 'testpass123',
          fullName: 'Test User'
        })
      });

      if (signupResponse.ok) {
        const signupResult = await signupResponse.json();
        
        // Test signin
        const signinResponse = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: testEmail,
            password: 'testpass123'
          })
        });

        if (signinResponse.ok) {
          testResults.push({
            name: 'Authentication',
            status: 'success',
            message: 'Authentication system working correctly',
            details: { testUser: signupResult.user.email }
          });
        } else {
          testResults.push({
            name: 'Authentication',
            status: 'error',
            message: 'Signin failed'
          });
        }
      } else {
        const error = await signupResponse.json();
        testResults.push({
          name: 'Authentication',
          status: 'error',
          message: `Signup failed: ${error.message}`
        });
      }
    } catch (error: any) {
      testResults.push({
        name: 'Authentication',
        status: 'error',
        message: `Auth test failed: ${error.message}`
      });
    }

    setTests([...testResults]);

    // Test 4: Environment Variables
    const envTest = {
      name: 'Environment Variables',
      status: 'success' as const,
      message: 'Environment check complete',
      details: {
        jwtSecret: process.env.JWT_SECRET ? '✅ Set' : '❌ Missing (Check server-side)'
      }
    };

    testResults.push(envTest);
    setTests([...testResults]);

    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'loading':
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
      default:
        return <Database className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-6 custom-underline">
            SQLite Database Test
          </h1>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Test your SQLite database connection and verify all systems are working correctly.
          </p>
        </div>

        {/* Test Controls */}
        <Card className="soft-shadow bg-white border-0 mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground flex items-center">
              <Database className="h-6 w-6 mr-3" />
              Database Connection Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={runTests}
              disabled={isRunning}
              className="btn-primary w-full md:w-auto"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Running Tests...
                </>
              ) : (
                'Run Database Tests'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Test Results */}
        {tests.length > 0 && (
          <div className="space-y-4">
            {tests.map((test, index) => (
              <Card key={index} className="soft-shadow bg-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {getStatusIcon(test.status)}
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">{test.name}</h3>
                      <p className="text-foreground/70 mb-3">{test.message}</p>
                      
                      {test.details && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-foreground mb-2">Details:</h4>
                          <pre className="text-sm text-foreground/70 whitespace-pre-wrap">
                            {typeof test.details === 'string' 
                              ? test.details 
                              : JSON.stringify(test.details, null, 2)
                            }
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Setup Instructions */}
        <Card className="soft-shadow bg-blue-50 border-0 mt-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-900">
              SQLite Setup Information
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">1. Database Location</h4>
                <p className="text-sm">The SQLite database is stored in the project root as 'soundous_bakes.db'</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">2. Schema Initialization</h4>
                <p className="text-sm">The database schema is automatically initialized when the server starts</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">3. Data Persistence</h4>
                <p className="text-sm">All data is stored locally in the SQLite database file</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">4. File Storage</h4>
                <p className="text-sm">Uploaded files are stored in the public/uploads directory</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}