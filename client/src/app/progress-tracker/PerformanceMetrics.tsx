import React from 'react';
import Icon from '@/components/ui/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface MetricData {
  month: string;
  resolved: number;
  submitted: number;
  avgDays: number;
}

interface DepartmentData {
  name: string;
  value: number;
  color: string;
}

interface PerformanceMetricsProps {
  monthlyData: MetricData[];
  departmentData: DepartmentData[];
  satisfactionTrend: { month: string; score: number }[];
}

const PerformanceMetrics = ({ monthlyData, departmentData, satisfactionTrend }: PerformanceMetricsProps) => {
  return (
    <div className="space-y-6">
      {/* Resolution Trends */}
      <div className="bg-card rounded-lg border border-border p-6 civic-shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Resolution Trends</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-text-secondary">Submitted</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-text-secondary">Resolved</span>
            </div>
          </div>
        </div>
        
        <div className="w-full h-64" aria-label="Monthly Resolution Trends Bar Chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E2E8F0', 
                  borderRadius: '8px',
                  fontSize: '12px'
                }} 
              />
              <Bar dataKey="submitted" fill="#2563EB" radius={[2, 2, 0, 0]} />
              <Bar dataKey="resolved" fill="#059669" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Performance */}
        <div className="bg-card rounded-lg border border-border p-6 civic-shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Department Performance</h3>
            <Icon name="ChartPieIcon" size={20} className="text-text-secondary" />
          </div>
          
          <div className="w-full h-48" aria-label="Department Performance Pie Chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
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
          
          <div className="space-y-2 mt-4">
            {departmentData.map((dept, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }}></div>
                  <span className="text-foreground">{dept.name}</span>
                </div>
                <span className="font-medium text-text-secondary">{dept.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Satisfaction Trend */}
        <div className="bg-card rounded-lg border border-border p-6 civic-shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Satisfaction Trend</h3>
            <div className="flex items-center space-x-2 text-sm text-text-secondary">
              <Icon name="FaceSmileIcon" size={16} />
              <span>Citizen Feedback</span>
            </div>
          </div>
          
          <div className="w-full h-48" aria-label="Satisfaction Trend Line Chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={satisfactionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="#64748B" fontSize={12} />
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
                  dataKey="score" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 p-3 bg-accent/10 rounded-civic">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Current Score</span>
              <span className="font-semibold text-accent">
                {satisfactionTrend[satisfactionTrend.length - 1]?.score}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;