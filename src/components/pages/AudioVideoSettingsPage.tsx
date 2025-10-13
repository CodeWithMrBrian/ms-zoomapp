import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Toggle } from '../ui/Toggle';
import { Breadcrumbs, BreadcrumbItem } from '../ui/Breadcrumbs';
import { useToast, Toast } from '../ui/Toast';

export interface AudioVideoSettingsPageProps {
  onBack: () => void;
}

// Mock device options
const MICROPHONE_DEVICES = [
  { value: 'default', label: 'Default - Built-in Microphone' },
  { value: 'usb_mic', label: 'USB Microphone (Logitech)' },
  { value: 'bluetooth', label: 'Bluetooth Headset (Sony WH-1000XM4)' }
];

const SPEAKER_DEVICES = [
  { value: 'default', label: 'Default - Built-in Speakers' },
  { value: 'usb_speaker', label: 'USB Speakers (Creative)' },
  { value: 'bluetooth', label: 'Bluetooth Headset (Sony WH-1000XM4)' }
];

const CAMERA_DEVICES = [
  { value: 'default', label: 'Default - Built-in Camera' },
  { value: 'usb_webcam', label: 'USB Webcam (Logitech C920)' },
  { value: 'virtual', label: 'Virtual Camera (OBS)' }
];

/**
 * AudioVideoSettingsPage Component
 *
 * Configure audio and video device settings.
 */
export function AudioVideoSettingsPage({ onBack }: AudioVideoSettingsPageProps) {
  const { toast, showToast } = useToast();

  // Device selections
  const [microphone, setMicrophone] = useState('default');
  const [speaker, setSpeaker] = useState('default');
  const [camera, setCamera] = useState('default');

  // Audio settings
  const [echoCancellation, setEchoCancellation] = useState(true);
  const [noiseSuppression, setNoiseSuppression] = useState(true);
  const [autoAdjustVolume, setAutoAdjustVolume] = useState(false);

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', onClick: onBack },
    { label: 'Preferences', onClick: onBack },
    { label: 'Audio & Video' }
  ];

  const handleTestAudio = () => {
    showToast('Testing audio... Playing test sound', 'info');
  };

  const handleSaveSettings = () => {
    showToast('Audio & Video settings saved successfully', 'success');
  };

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
              Back to Preferences
            </Button>
          </div>

          <Breadcrumbs items={breadcrumbItems} className="mb-4" />

          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Audio & Video Settings
          </h1>
        </div>

        <div className="space-y-6">
          {/* Audio Devices */}
          <Card>
            <CardHeader>
              <CardTitle>Audio Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select
                  label="Microphone"
                  options={MICROPHONE_DEVICES}
                  value={microphone}
                  onChange={(e) => setMicrophone(e.target.value)}
                />

                <Select
                  label="Speaker"
                  options={SPEAKER_DEVICES}
                  value={speaker}
                  onChange={(e) => setSpeaker(e.target.value)}
                />

                <div className="pt-2">
                  <Button variant="outline" onClick={handleTestAudio}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    Test Audio
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Video Devices */}
          <Card>
            <CardHeader>
              <CardTitle>Video Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                label="Camera"
                options={CAMERA_DEVICES}
                value={camera}
                onChange={(e) => setCamera(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Audio Enhancements */}
          <Card>
            <CardHeader>
              <CardTitle>Audio Enhancements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Toggle
                  enabled={echoCancellation}
                  onChange={setEchoCancellation}
                  label="Echo Cancellation"
                  description="Reduce echo and feedback during calls"
                />

                <Toggle
                  enabled={noiseSuppression}
                  onChange={setNoiseSuppression}
                  label="Noise Suppression"
                  description="Filter out background noise"
                />

                <Toggle
                  enabled={autoAdjustVolume}
                  onChange={setAutoAdjustVolume}
                  label="Auto-Adjust Volume"
                  description="Automatically adjust microphone volume"
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSaveSettings}>
              Save Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Toast */}
      <Toast {...toast} />
    </div>
  );
}
