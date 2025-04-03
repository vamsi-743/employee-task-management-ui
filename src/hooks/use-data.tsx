import { useQuery } from '@tanstack/react-query';
import { getAllDepartments, getAllEmployees } from '@/http/api';
import { useAuth } from '@/hooks/use-auth';

export const useDepartments = () => {
  const { user } = useAuth();
  const payload = { organization_id: user.organization_id };

  const { data, isLoading, error } = useQuery({
    queryKey: ['departments'],
    queryFn: () => getAllDepartments(payload),
  });

  return {
    departments: data?.data || [],
    isLoading,
    error,
  };
};

