import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { MOCK_TEMPLATES } from '../../utils/mockData';
import { LANGUAGES, MEETING_TYPES } from '../../utils/constants';
import { Template, MeetingType } from '../../types';
import { TemplatePreviewPage } from '../pages/TemplatePreviewPage';
import { TemplateStatsPage } from '../pages/TemplateStatsPage';

/**
 * TemplatesTab Component
 *
 * Manage session templates for quick meeting setup.
 *
 * Features:
 * - Template list with details
 * - Create new templates
 * - Edit existing templates
 * - Delete templates
 * - Template preview with all settings
 */

type TemplatesView = 'main' | 'preview' | 'stats';

export function TemplatesTab() {
  const [templates, setTemplates] = useState<Template[]>(MOCK_TEMPLATES);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [currentView, setCurrentView] = useState<TemplatesView>('main');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  // Form state for creating/editing
  const [formName, setFormName] = useState('');
  const [formMeetingType, setFormMeetingType] = useState<MeetingType>('general');
  const [formSourceLanguage, setFormSourceLanguage] = useState('en');
  const [formTargetLanguages, setFormTargetLanguages] = useState<string[]>([]);
  const [formGlossaryId, setFormGlossaryId] = useState<string | null>(null);
  const [formInstructions, setFormInstructions] = useState('');

  // Get language name
  const getLanguageName = (code: string) => {
    return LANGUAGES.find(l => l.code === code)?.name || code.toUpperCase();
  };

  // Get meeting type name
  const getMeetingTypeName = (type: MeetingType) => {
    return MEETING_TYPES.find(t => t.value === type)?.label || type;
  };

  // Start creating new template
  const startCreating = () => {
    setIsCreating(true);
    setEditingTemplate(null);
    resetForm();
  };

  // Start editing template
  const startEditing = (template: Template) => {
    setIsCreating(false);
    setEditingTemplate(template);
    setFormName(template.name);
    setFormMeetingType(template.meeting_type);
    setFormSourceLanguage(template.source_language);
    setFormTargetLanguages(template.target_languages);
    setFormGlossaryId(template.glossary_id || null);
    setFormInstructions(template.host_instructions || '');
  };

  // Reset form
  const resetForm = () => {
    setFormName('');
    setFormMeetingType('general');
    setFormSourceLanguage('en');
    setFormTargetLanguages([]);
    setFormGlossaryId(null);
    setFormInstructions('');
  };

  // Cancel creating/editing
  const cancelForm = () => {
    setIsCreating(false);
    setEditingTemplate(null);
    resetForm();
  };

  // Save template
  const saveTemplate = () => {
    if (!formName.trim()) {
      alert('Please enter a template name');
      return;
    }
    if (formTargetLanguages.length === 0) {
      alert('Please select at least one target language');
      return;
    }
    const templateData: Omit<Template, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
      name: formName,
      meeting_type: formMeetingType,
      source_language: formSourceLanguage,
      target_languages: formTargetLanguages,
      glossary_id: formGlossaryId || undefined,
      host_instructions: formInstructions || undefined,
      tts_enabled: false,
      confidence_threshold: 0.8,
      show_partial_results: true
    };
    if (editingTemplate) {
      setTemplates(prev => prev.map(t =>
        t.id === editingTemplate.id
          ? { ...t, ...templateData, updated_at: new Date().toISOString() }
          : t
      ));
    } else {
      const newTemplate: Template = {
        id: `template_${Date.now()}`,
        user_id: 'current_user',
        ...templateData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setTemplates(prev => [...prev, newTemplate]);
    }
    cancelForm();
  };

  // Delete template
  const deleteTemplate = (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      setTemplates(prev => prev.filter(t => t.id !== templateId));
    }
  };

  // Toggle target language
  const toggleLanguage = (langCode: string) => {
    setFormTargetLanguages(prev => {
      if (prev.includes(langCode)) {
        return prev.filter(code => code !== langCode);
      } else {
        return [...prev, langCode];
      }
    });
  };

  // Navigate to preview page
  const handlePreview = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setCurrentView('preview');
  };

  // Navigate to stats page
  // ...existing code...

  // Back to main view
  const handleBackToMain = () => {
    setCurrentView('main');
    setSelectedTemplateId(null);
  };

  // Handle edit from preview page
  const handleEditFromPreview = () => {
    if (selectedTemplateId) {
      const template = templates.find(t => t.id === selectedTemplateId);
      if (template) {
        setCurrentView('main');
        startEditing(template);
      }
    }
  };

  // Handle use template
  const handleUseTemplate = (templateId: string) => {
    // In a real app, this would navigate to session creation with template pre-filled
    alert(`This would start a new session with template ${templateId}. Feature coming in next phase!`);
  };

  return (
    <>
      {/* Render preview page */}
      {currentView === 'preview' && selectedTemplateId ? (
        <TemplatePreviewPage
          templateId={selectedTemplateId!}
          onBack={handleBackToMain}
          onEdit={handleEditFromPreview}
          onUse={() => handleUseTemplate(selectedTemplateId!)}
        />
      ) : currentView === 'stats' && selectedTemplateId ? (
        <TemplateStatsPage
          templateId={selectedTemplateId!}
          onBack={handleBackToMain}
        />
      ) : (
        <>
          {/* Create/Edit Form */}
          {(isCreating || editingTemplate) && (
            <Card variant="default" padding="lg">
              <CardHeader>
                <CardTitle>
                  {isCreating ? 'Create New Template' : 'Edit Template'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Template Name */}
                  <Input
                    type="text"
                    label="Template Name"
                    placeholder="e.g., Weekly Team Meeting"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                  {/* Meeting Type */}
                  <Select
                    label="Meeting Type"
                    value={formMeetingType}
                    onChange={(e) => setFormMeetingType(e.target.value as MeetingType)}
                    options={MEETING_TYPES.map(type => ({
                      value: type.value,
                      label: type.label
                    }))}
                  />
                  {/* Source Language */}
                  <Select
                    label="Source Language"
                    value={formSourceLanguage}
                    onChange={(e) => setFormSourceLanguage(e.target.value)}
                    options={LANGUAGES.map(lang => ({
                      value: lang.code,
                      label: `${lang.flag} ${lang.name}`
                    }))}
                  />
                  {/* Target Languages */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Target Languages (Select multiple)
                    </label>
                    {/* Tier Language Adjustment Notice */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 mt-0.5">
                          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-blue-800 dark:text-blue-200">
                            <strong>Note:</strong> Language selection may need adjustments depending on your active tier. 
                            Starter tier allows up to 3 languages, Professional up to 8 languages, and Enterprise unlimited languages.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 max-h-48 overflow-y-auto">
                      <div className="grid grid-cols-2 gap-3">
                        {LANGUAGES.slice(0, 12).map(lang => (
                          <label key={lang.code} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formTargetLanguages.includes(lang.code)}
                              onChange={() => toggleLanguage(lang.code)}
                              className="w-4 h-4 text-teal-600 rounded"
                            />
                            <span className="text-sm text-gray-900 dark:text-gray-100">
                              {lang.flag} {lang.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Selected: {formTargetLanguages.length} language{formTargetLanguages.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  {/* Host Instructions */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Host Instructions (Optional)
                    </label>
                    <textarea
                      value={formInstructions}
                      onChange={(e) => setFormInstructions(e.target.value)}
                      placeholder="Instructions for participants..."
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>
                  {/* Form Actions */}
                  <div className="flex gap-3">
                    <Button variant="primary" onClick={saveTemplate}>
                      {isCreating ? 'Create Template' : 'Save Changes'}
                    </Button>
                    <Button variant="secondary" onClick={cancelForm}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Template List */}
          {!isCreating && !editingTemplate && (
            <div className="space-y-4">
              {templates.length === 0 && (
                <Card variant="default" padding="lg">
                  <CardContent>
                    <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                      No templates yet. Create your first template to save time on recurring meetings!
                    </p>
                  </CardContent>
                </Card>
              )}
              {templates.map(template => (
                <Card key={template.id} variant="hover" padding="lg">
                  <div className="space-y-4">
                    {/* Template Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {template.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Created: {new Date(template.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="info">
                        {getMeetingTypeName(template.meeting_type)}
                      </Badge>
                    </div>
                    {/* Template Details */}
                    <div className="border-t border-gray-100 dark:border-gray-700 pt-3 space-y-2 text-sm">
                      <p>
                        <strong>Languages:</strong> {getLanguageName(template.source_language)} → {template.target_languages.map(code => getLanguageName(code)).join(', ')}
                      </p>
                      {template.glossary_id && (
                        <p>
                          <strong>Glossary:</strong> {template.glossary_name || 'Active'}
                        </p>
                      )}
                      {template.host_instructions && (
                        <p>
                          <strong>Instructions:</strong> {template.host_instructions.substring(0, 100)}{template.host_instructions.length > 100 ? '...' : ''}
                        </p>
                      )}
                    </div>
                    {/* Template Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button variant="primary" size="sm" onClick={() => handleUseTemplate(template.id)}>
                        Use Template
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => handlePreview(template.id)}>
                        Preview
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => startEditing(template)}>
                        Edit
                      </Button>
                      <Button variant="tertiary" size="sm" onClick={() => deleteTemplate(template.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
  return (
    <>
      {/* Render preview page */}
      {currentView === 'preview' && selectedTemplateId && (
        <TemplatePreviewPage
          templateId={selectedTemplateId!}
          onBack={handleBackToMain}
          onEdit={handleEditFromPreview}
          onUse={() => handleUseTemplate(selectedTemplateId!)}
        />
      )}
      {/* Render stats page */}
      {currentView === 'stats' && selectedTemplateId && (
        <TemplateStatsPage
          templateId={selectedTemplateId!}
          onBack={handleBackToMain}
        />
      )}
      {/* Create/Edit Form */}
      {(currentView === 'main') && (isCreating || editingTemplate) && (
        <Card variant="default" padding="lg">
          <CardHeader>
            <CardTitle>
              {isCreating ? 'Create New Template' : 'Edit Template'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Template Name */}
              <Input
                type="text"
                label="Template Name"
                placeholder="e.g., Weekly Team Meeting"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
              {/* Meeting Type */}
              <Select
                label="Meeting Type"
                value={formMeetingType}
                onChange={(e) => setFormMeetingType(e.target.value as MeetingType)}
                options={MEETING_TYPES.map(type => ({
                  value: type.value,
                  label: type.label
                }))}
              />
              {/* Source Language */}
              <Select
                label="Source Language"
                value={formSourceLanguage}
                onChange={(e) => setFormSourceLanguage(e.target.value)}
                options={LANGUAGES.map(lang => ({
                  value: lang.code,
                  label: `${lang.flag} ${lang.name}`
                }))}
              />
              {/* Target Languages */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Target Languages (Select multiple)
                </label>
                {/* Tier Language Adjustment Notice */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-blue-800 dark:text-blue-200">
                        <strong>Note:</strong> Language selection may need adjustments depending on your active tier. 
                        Starter tier allows up to 3 languages, Professional up to 8 languages, and Enterprise unlimited languages.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 max-h-48 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-3">
                    {LANGUAGES.slice(0, 12).map(lang => (
                      <label key={lang.code} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formTargetLanguages.includes(lang.code)}
                          onChange={() => toggleLanguage(lang.code)}
                          className="w-4 h-4 text-teal-600 rounded"
                        />
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                          {lang.flag} {lang.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Selected: {formTargetLanguages.length} language{formTargetLanguages.length !== 1 ? 's' : ''}
                </p>
              </div>
              {/* Host Instructions */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Host Instructions (Optional)
                </label>
                <textarea
                  value={formInstructions}
                  onChange={(e) => setFormInstructions(e.target.value)}
                  placeholder="Instructions for participants..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
              {/* Form Actions */}
              <div className="flex gap-3">
                <Button variant="primary" onClick={saveTemplate}>
                  {isCreating ? 'Create Template' : 'Save Changes'}
                </Button>
                <Button variant="secondary" onClick={cancelForm}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Template List */}
      {!isCreating && !editingTemplate && (
        <div className="space-y-4">
          {/* Create New Template Button */}
          <div className="flex justify-end">
            <Button variant="primary" onClick={startCreating}>
              Create New Template
            </Button>
          </div>
          {templates.length === 0 && (
            <Card variant="default" padding="lg">
              <CardContent>
                <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                  No templates yet. Create your first template to save time on recurring meetings!
                </p>
              </CardContent>
            </Card>
          )}
          {templates.map(template => (
            <Card key={template.id} variant="hover" padding="lg">
              <div className="space-y-4">
                {/* Template Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Created: {new Date(template.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="info">
                    {getMeetingTypeName(template.meeting_type)}
                  </Badge>
                </div>
                {/* Template Details */}
                <div className="border-t border-gray-100 dark:border-gray-700 pt-3 space-y-2 text-sm">
                  <p>
                    <strong>Languages:</strong> {getLanguageName(template.source_language)} → {template.target_languages.map(code => getLanguageName(code)).join(', ')}
                  </p>
                  {template.glossary_id && (
                    <p>
                      <strong>Glossary:</strong> {template.glossary_name || 'Active'}
                    </p>
                  )}
                  {template.host_instructions && (
                    <p>
                      <strong>Instructions:</strong> {template.host_instructions.substring(0, 100)}{template.host_instructions.length > 100 ? '...' : ''}
                    </p>
                  )}
                </div>
                {/* Template Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="primary" size="sm" onClick={() => handleUseTemplate(template.id)}>
                    Use Template
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => handlePreview(template.id)}>
                    Preview
                  </Button>
                  {/* Stats button removed: handleViewStats no longer exists */}
                  <Button variant="secondary" size="sm" onClick={() => startEditing(template)}>
                    Edit
                  </Button>
                  <Button variant="tertiary" size="sm" onClick={() => deleteTemplate(template.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
