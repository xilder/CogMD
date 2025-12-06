import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStatItem, DashboardStatsResponse } from '@/types/schemas';
import { BookOpen, Target, TrendingUp, Zap } from 'lucide-react';
import { ForwardRefExoticComponent } from 'react';

type KPI = DashboardStatItem & {
  icon: ForwardRefExoticComponent<any>;
  label:
    | 'Overall Progress'
    | 'Questions Answered'
    | 'Accuracy Rate'
    | 'Study Streak';
};

const mockKpis = [
  {
    icon: TrendingUp,
    label: 'Overall Progress',
    value: 68,
    change: 5,
  },
  {
    icon: BookOpen,
    label: 'Questions Answered',
    value: 342,
    change: 28,
  },
  {
    icon: Target,
    label: 'Accuracy Rate',
    value: 76,
    change: 2,
  },
  {
    icon: Zap,
    label: 'Study Streak',
    value: 12,
    change: 1,
  },
];

export default function KPICards({
  items,
}: {
  items?: DashboardStatsResponse;
}) {
  const userKpis = [
    {
      icon: TrendingUp,
      label: 'Overall Progress',
      value: items?.overallProgress.value,
      change: items?.overallProgress.change,
    },
    {
      icon: BookOpen,
      label: 'Questions Answered',
      value: items?.questionsAnswered.value,
      change: items?.questionsAnswered.change,
    },
    {
      icon: Target,
      label: 'Accuracy Rate',
      value: items?.accuracyRate.value,
      change: items?.accuracyRate.change,
    },
    {
      icon: Zap,
      label: 'Study Streak',
      value: items?.studyStreak.value,
      change: items?.studyStreak.change,
    },
  ];

  const getValueOutput = (kpiObj: KPI) => {
    const displayValue = `${kpiObj.value % 1 !== 0 ? kpiObj.value.toFixed(2) : kpiObj.value}${
      kpiObj.label === 'Overall Progress' || kpiObj.label === 'Accuracy Rate'
        ? '%'
        : ''
    }`;
    const detail = kpiObj.label === 'Study Streak' ? ' days' : '';
    return `${displayValue + detail}`;
  };

  const getChangeOutput = (kpiObj: KPI) => {
    const displayValue = `${
      kpiObj.change > 0 && kpiObj.label !== 'Study Streak' ? '+' : ''
    }${kpiObj.label === 'Study Streak' ? '' : kpiObj.change % 1 !== 0 ? kpiObj.change.toFixed(2) : kpiObj.change}${
      kpiObj.label === 'Overall Progress' || kpiObj.label === 'Accuracy Rate'
        ? '%'
        : ''
    }`;
    const detail =
      kpiObj.label === 'Overall Progress' || kpiObj.label === 'Accuracy Rate'
        ? ' this week'
        : kpiObj.label === 'Questions Answered'
        ? ' today'
        : kpiObj.change > 3
        ? 'Keep it up!'
        : "Let's build that streak";
    return `${displayValue + detail}`;
  };

  const kpis = (items ? userKpis : mockKpis) as KPI[];
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <Card key={index} className='hover:shadow-md transition-shadow'>
            <CardHeader className='pb-3'>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-sm font-medium text-muted-foreground'>
                  {kpi.label}
                </CardTitle>
                <div className='w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center'>
                  <Icon className='w-4 h-4 text-primary' />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-foreground mb-1'>
                {getValueOutput(kpi)}
              </div>
              <p className='text-xs text-muted-foreground'>
                {getChangeOutput(kpi)}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
