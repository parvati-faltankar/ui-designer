import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BuilderLayout from '../components/builder/BuilderLayout';
import { useBuilderStore } from '../store/useBuilderStore';

const PageBuilder: React.FC = () => {
  const { projectId, pageId } = useParams<{ projectId: string; pageId: string }>();
  const { setNodes, clear, setProjectTheme } = useBuilderStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pagesRes, projRes] = await Promise.all([
          fetch(`/api/pages/${projectId}`),
          fetch(`/api/projects/${projectId}`)
        ]);
        const pagesData = await pagesRes.json();
        const projData = await projRes.json();
        
        if (projData.success && projData.data) {
          setProjectTheme(projData.data.themeTemplate || 'enterprise-blue');
        }

        if (pagesData.success && pagesData.data) {
          const page = pagesData.data.find((p: any) => p._id === pageId);
          if (page) {
            setNodes(page.layoutTree || []);
          } else {
            clear();
          }
        } else {
          clear();
        }
      } catch (err) {
        console.error('Failed to load page data', err);
      }
    };

    loadData();
    return () => clear();
  }, [projectId, pageId, setNodes, clear, setProjectTheme]);

  return <BuilderLayout />;
};

export default PageBuilder;
