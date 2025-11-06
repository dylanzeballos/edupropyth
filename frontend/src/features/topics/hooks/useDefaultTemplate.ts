import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { courseTemplateService } from '@/features/courses/services/course-template.service';

interface UseDefaultTemplateProps {
  courseId?: string;
  hasTemplate: boolean;
  isLoadingTemplate: boolean;
}

export const useDefaultTemplate = ({
  courseId,
  hasTemplate,
  isLoadingTemplate,
}: UseDefaultTemplateProps) => {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const createDefaultTemplate = async () => {
      if (!isLoadingTemplate && !hasTemplate && courseId && !isCreating) {
        setIsCreating(true);
        try {
          await courseTemplateService.createDefaultTemplate(courseId);
          queryClient.invalidateQueries({
            queryKey: ['course-templates', 'course', courseId],
          });
        } catch (error) {
          console.error('Error creating default template:', error);
        } finally {
          setIsCreating(false);
        }
      }
    };

    createDefaultTemplate();
  }, [courseId, hasTemplate, isLoadingTemplate, isCreating, queryClient]);

  return { isCreating };
};
