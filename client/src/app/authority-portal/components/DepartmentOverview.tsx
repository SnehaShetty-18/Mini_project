import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface Department {
  id: string;
  name: string;
  activeIssues: number;
  resolvedToday: number;
  avgResponseTime: string;
  satisfaction: number;
  budget: string;
  utilization: number;
  icon: string;
  color: string;
}

interface DepartmentOverviewProps {
  departments: Department[];
}

const DepartmentOverview = ({ departments }: DepartmentOverviewProps) => {
  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Department Overview</h3>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="border border-border rounded-lg p-4 hover:civic-shadow civic-transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${dept.color}`}>
                    <Icon name={dept.icon as any} size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{dept.name}</h4>
                    <p className="text-xs text-text-secondary">Budget: {dept.budget}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">{dept.activeIssues}</p>
                  <p className="text-xs text-text-secondary">Active Issues</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-sm font-semibold text-success">{dept.resolvedToday}</p>
                  <p className="text-xs text-text-secondary">Resolved Today</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">{dept.avgResponseTime}</p>
                  <p className="text-xs text-text-secondary">Avg Response</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-secondary">Satisfaction</span>
                    <span className="font-medium text-foreground">{dept.satisfaction}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-accent h-2 rounded-full civic-transition"
                      style={{ width: `${dept.satisfaction}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-secondary">Budget Utilization</span>
                    <span className="font-medium text-foreground">{dept.utilization}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full civic-transition"
                      style={{ width: `${dept.utilization}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DepartmentOverview;