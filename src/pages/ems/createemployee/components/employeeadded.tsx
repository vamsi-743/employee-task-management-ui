import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useNavigate } from 'react-router-dom';

export default function EmployeeAdded({ employeeData ,setCurrentStep}: { employeeData: any,setCurrentStep:any }) {
  const [confetti, setConfetti] = useState(false);
  const navigate = useNavigate();
console.log("employeeDatadsdasd",employeeData)
  useEffect(() => {
    setConfetti(true);
    const timer = setTimeout(() => setConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="mx-auto w-full max-w-md bg-card shadow-lg">
      <CardContent className="flex flex-col items-center space-y-6 p-8">
        {confetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
          />
        )}

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-primary/10"
        >
          <svg
            className="h-32 w-32"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="32" cy="32" r="32" fill="var(--card)" />
            <circle cx="32" cy="26" r="10" fill="var(--foreground)" />
            <path
              d="M32 38C23.1634 38 16 45.1634 16 54H48C48 45.1634 40.8366 38 32 38Z"
              fill="var(--foreground)"
            />
            <circle cx="32" cy="26" r="4" fill="white" />
            <path d="M28 50H36V54H28V50Z" fill="white" />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2 text-center"
        >
          <h2 className="text-2xl font-bold text-foreground">
            You successfully added {employeeData.first_name} {employeeData.last_name}
          </h2>

          <p className="text-sm text-muted-foreground">
            You can edit your employees&apos; information anytime from the
            employee
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex w-full flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0"
        >
          <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/80" onClick={() => setCurrentStep(0)}>
            Add Another Employee
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-primary text-primary hover:bg-primary/10"
            onClick={() => navigate(`/ems/employees`)}
          >
            Go to Edit Employee
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}
