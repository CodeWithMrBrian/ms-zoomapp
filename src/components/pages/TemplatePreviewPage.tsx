import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Breadcrumbs, BreadcrumbItem } from '../ui/Breadcrumbs';
import { useToast, Toast } from '../ui/Toast';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { MOCK_TEMPLATES } from '../../utils/mockData';
import { getLanguageByCode } from '../../utils/constants';

export interface TemplatePreviewPageProps {
  templateId: string;
  onBack: () => void;
  onEdit?: () => void;
  onUse?: () => void;
}

/**
 * TemplatePreviewPage Component
 *
 * Displays detailed template information with usage stats and actions.
 */
export function TemplatePreviewPage({ templateId, onBack, onEdit, onUse }: TemplatePreviewPageProps) {
  const { toast, showToast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showHostInstructions, setShowHostInstructions] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  // Using second template (Monthly All-Hands) as it has more features
  const template = MOCK_TEMPLATES[1];

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', onClick: onBack },
    { label: 'Templates', onClick: onBack },
    { label: 'Template Preview' }
  ];

  // Mock usage stats
  const usageStats = {
    timesUsed: 12,
    lastUsed: '2025-09-22',
    avgDuration: '1.2 hours',
    totalParticipants: 1248
  };

  const handleUseTemplate = () => {
    if (onUse) {
      onUse();
    } else {
      showToast('Template applied to current session', 'success');
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      showToast('Opening template editor...', 'info');
    }
  };

  const handleDuplicate = () => {
    showToast('Template duplicated successfully', 'success');
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    showToast('Template deleted', 'success');
    setShowDeleteConfirm(false);
    setTimeout(onBack, 1000);
  };

  // Get language details
  const sourceLanguage = getLanguageByCode(template.source_language);
  const targetLanguages = template.target_languages
    .map(code => getLanguageByCode(code))
    .filter(lang => lang !== undefined);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="tertiary" onClick={onBack} className="gap-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Templates
            </Button>
          </div>

          <Breadcrumbs items={breadcrumbItems} className="mb-4" />

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {template.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Created on {new Date(template.created_at).toLocaleDateString()}
              </p>
            </div>
            <Button onClick={handleUseTemplate}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              Use This Template
            </Button>
          </div>
        </div>

        {/* Usage Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2">
                {usageStats.timesUsed}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Times Used</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2">
                {usageStats.avgDuration}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Duration</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2">
                {usageStats.totalParticipants}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Participants</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center py-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Last Used</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {new Date(usageStats.lastUsed).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Template Details */}
        <div className="space-y-6">
          {/* Languages */}
          <Card>
            <CardHeader>
              <CardTitle>Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Source Language
                  </p>
                  <Badge variant="info" size="md">
                    {sourceLanguage?.name} ({sourceLanguage?.native_name})
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Languages ({targetLanguages.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {targetLanguages.map((lang) => (
                      <Badge key={lang!.code} variant="neutral">
                        {lang!.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Meeting Type */}
          <Card>
            <CardHeader>
              <CardTitle>Meeting Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Meeting Type
                  </p>
                  <p className="text-gray-900 dark:text-gray-100 capitalize">
                    {template.meeting_type?.replace('_', ' ') || 'General'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Glossary Attached
                  </p>
                  {template.glossary_id ? (
                    <Badge variant="success">Product Names</Badge>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-500">None</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Host Instructions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Host Instructions</CardTitle>
                <Button
                  variant="tertiary"
                  size="sm"
                  onClick={() => setShowHostInstructions(!showHostInstructions)}
                >
                  {showHostInstructions ? 'Hide' : 'Show'}
                </Button>
              </div>
            </CardHeader>
            {showHostInstructions && (
              <CardContent>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                    {template.host_instructions || 'No instructions provided'}
                  </p>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Advanced Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Advanced Settings</CardTitle>
                <Button
                  variant="tertiary"
                  size="sm"
                  onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                >
                  {showAdvancedSettings ? 'Hide' : 'Show'}
                </Button>
              </div>
            </CardHeader>
            {showAdvancedSettings && (
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        Text-to-Speech (TTS)
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Audio narration of translations
                      </p>
                    </div>
                    <Badge variant={template.tts_enabled ? 'success' : 'neutral'}>
                      {template.tts_enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        Confidence Threshold
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Minimum confidence for displaying translations
                      </p>
                    </div>
                    <Badge variant="info">
                      {template.confidence_threshold}%
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        Partial Results
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Show translations before final confirmation
                      </p>
                    </div>
                    <Badge variant={template.show_partial_results ? 'success' : 'neutral'}>
                      {template.show_partial_results ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" onClick={handleUseTemplate}>
                  Use This Template
                </Button>
                <Button variant="outline" onClick={handleEdit}>
                  Edit Template
                </Button>
                <Button variant="outline" onClick={handleDuplicate}>
                  Duplicate
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Template?"
        message="Are you sure you want to delete this template? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />

      {/* Toast */}
      <Toast {...toast} />
    </div>
  );
}
