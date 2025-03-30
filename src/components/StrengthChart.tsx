import  { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { analyzePassword } from '../utils/passwordUtils';
import { Chart, registerables } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { BarChart, User } from 'lucide-react';

// Register Chart.js components
Chart.register(...registerables);

interface StrengthChartProps {
  password: string;
  score: number;
  entropy: number;
}

const StrengthChart = ({ password, score, entropy }: StrengthChartProps) => {
  const [isActive, setIsActive] = useState(true);
  const chartRef = useRef<Chart<"doughnut", number[], string> | null>(null);
  
  const strengths = {
    length: 0,
    complexity: 0,
    uniqueness: 0,
    unpredictability: 0
  };
  
  // Calculate individual strength metrics
  if (password) {
    // Length score (max 25)
    strengths.length = Math.min(25, password.length * 2);
    
    // Complexity score based on character types (max 25)
    let types = 0;
    if (/[a-z]/.test(password)) types++;
    if (/[A-Z]/.test(password)) types++;
    if (/[0-9]/.test(password)) types++;
    if (/[^a-zA-Z0-9]/.test(password)) types++;
    strengths.complexity = types * 6.25;
    
    // Uniqueness score based on unique characters ratio (max 25)
    const uniqueChars = new Set(password.split('')).size;
    strengths.uniqueness = Math.min(25, (uniqueChars / password.length) * 25);
    
    // Unpredictability based on entropy (max 25)
    strengths.unpredictability = Math.min(25, entropy / 5);
  }
  
  const data = {
    labels: ['Length', 'Complexity', 'Uniqueness', 'Unpredictability'],
    datasets: [
      {
        data: [
          strengths.length,
          strengths.complexity,
          strengths.uniqueness,
          strengths.unpredictability
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 12,
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value.toFixed(1)}/25`;
          }
        }
      }
    },
    cutout: '70%',
    animation: {
      animateRotate: true,
      animateScale: true
    }
  };
  
  // Animation to highlight strengths
  useEffect(() => {
    if (chartRef.current) {
      const timer = setInterval(() => {
        if (chartRef.current) {
          const dataset = chartRef.current.data.datasets[0];
          const currentIndex = dataset.backgroundColor.findIndex(
            (color: any) => typeof color === 'string' && color.includes('1)')
          );
          
          // Reset all to normal opacity
          dataset.backgroundColor = dataset.backgroundColor.map((color: any, i: number) => 
            typeof color === 'string' ? color.replace('1)', '0.7)') : color
          );
          
          // Highlight next segment
          const nextIndex = (currentIndex + 1) % dataset.backgroundColor.length;
          dataset.backgroundColor[nextIndex] = dataset.backgroundColor[nextIndex].toString().replace('0.7)', '1)');
          
          chartRef.current.update();
        }
      }, 2000);
      
      return () => clearInterval(timer);
    }
  }, [chartRef.current]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-4 p-4 rounded-lg border border-gray-200 bg-white"
    >
      <div className="flex items-center mb-3">
        <BarChart size={18} className="mr-2 text-blue-500" />
        <h3 className="text-sm font-medium text-gray-700">Strength Analysis</h3>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="w-full h-48 relative">
          <Doughnut 
            data={data} 
            options={options}
            ref={(reference) => chartRef.current = reference}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-gray-800">{score}/4</div>
              <div className="text-xs text-gray-500">Overall Score</div>
            </motion.div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-2 w-full">
          {Object.entries(strengths).map(([key, value]) => (
            <div key={key} className="p-2 bg-gray-50 rounded border border-gray-100">
              <div className="text-xs text-gray-500 capitalize mb-1">{key}</div>
              <div className="flex items-center">
                <div className="w-full h-1.5 bg-gray-200 rounded-full mr-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(value / 25) * 100}%` }}
                    transition={{ duration: 1 }}
                    className={`h-full rounded-full ${
                      value < 10 ? 'bg-red-500' :
                      value < 15 ? 'bg-orange-500' :
                      value < 20 ? 'bg-green-500' :
                      'bg-blue-500'
                    }`}
                  />
                </div>
                <span className="text-xs font-medium w-8">{value.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default StrengthChart;
 