import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface PerformanceData {
  responseTimeData: Array<{ month: string; avgTime: number; target: number }>;
  resolutionRateData: Array<{ department: string; resolved: number; pending: number }>;
  satisfactionData: Array<{ name: string; value: number; color: string }>;
}

interface PerformanceMetricsProps {
  data: PerformanceData;
}

const PerformanceMetrics = ({ data }: PerformanceMetricsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Response Time Trends */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Response Time Trends</h3>
        <div className="w-full h-64" aria-label="Response Time Trends Line Chart">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="month" 
                stroke="#64748B"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748B"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="avgTime" 
                stroke="#2563EB" 
                strokeWidth={2}
                name="Avg Response Time (hrs)"
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="#10B981" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Target (hrs)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resolution Rates by Department */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Resolution Rates by Department</h3>
        <div className="w-full h-64" aria-label="Resolution Rates Bar Chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.resolutionRateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="department" 
                stroke="#64748B"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke="#64748B"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="resolved" fill="#10B981" name="Resolved" />
              <Bar dataKey="pending" fill="#F59E0B" name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Citizen Satisfaction Distribution */}
      <div className="bg-card border border-border rounded-lg p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold text-foreground mb-4">Citizen Satisfaction Distribution</h3>
        <div className="flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 h-64" aria-label="Satisfaction Distribution Pie Chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.satisfactionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.satisfactionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="w-full lg:w-1/2 lg:pl-8">
            <div className="space-y-4">
              {data.satisfactionData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-medium text-foreground">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">4.2/5.0</p>
                <p className="text-sm text-text-secondary">Overall Satisfaction Score</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;