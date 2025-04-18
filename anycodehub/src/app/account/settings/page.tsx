"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Laptop, 
  Moon, 
  Shield, 
  Smartphone, 
  Sun,
  Trash
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    appearance: {
      theme: "system",
      fontSize: "medium",
      reducedMotion: false,
      reducedBranding: false,
    },
    language: "en",
    notifications: {
      email: {
        courseUpdates: true,
        messages: true,
        marketingOffers: false,
        accountNotices: true,
      },
      push: {
        courseUpdates: true,
        messages: true,
        marketingOffers: false,
        accountNotices: false,
      },
      frequency: "immediately",
    },
    privacy: {
      profileVisibility: "public",
      showCourseProgress: true,
      showLastSeen: true,
      allowDataCollection: true,
    },
    devices: [
      {
        id: "device-1",
        name: "Windows PC - Chrome",
        lastActive: "Just now",
        location: "Ho Chi Minh City, Vietnam",
        isCurrent: true,
      },
      {
        id: "device-2",
        name: "iPhone 13 - Safari",
        lastActive: "2 days ago",
        location: "Ho Chi Minh City, Vietnam",
        isCurrent: false,
      },
      {
        id: "device-3",
        name: "MacBook Pro - Firefox",
        lastActive: "1 week ago",
        location: "Da Nang, Vietnam",
        isCurrent: false,
      },
    ],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSettingChange = (section: keyof typeof settings, key: string, value: any) => {
    if (key.includes(".")) {
      const [parentKey, childKey] = key.split(".");
      setSettings({
        ...settings,
        [section]: {
          ...settings[section],
          [parentKey]: {
            ...(settings[section] as any)[parentKey],
            [childKey]: value,
          },
        },
      });
    } else {
      setSettings({
        ...settings,
        [section]: {
          ...settings[section],
          [key]: value,
        },
      });
    }
  };

  const handleSaveSettings = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    });
    
    setIsSubmitting(false);
  };

  const handleRemoveDevice = (deviceId: string) => {
    setSettings({
      ...settings,
      devices: settings.devices.filter(device => device.id !== deviceId),
    });
    
    toast({
      title: "Device removed",
      description: "The device has been removed from your account.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>
        
        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the application looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant={settings.appearance.theme === "light" ? "default" : "outline"}
                    className="flex flex-col items-center justify-center gap-1 h-20"
                    onClick={() => handleSettingChange("appearance", "theme", "light")}
                  >
                    <Sun className="h-5 w-5" />
                    <span className="text-xs">Light</span>
                  </Button>
                  <Button 
                    variant={settings.appearance.theme === "dark" ? "default" : "outline"}
                    className="flex flex-col items-center justify-center gap-1 h-20"
                    onClick={() => handleSettingChange("appearance", "theme", "dark")}
                  >
                    <Moon className="h-5 w-5" />
                    <span className="text-xs">Dark</span>
                  </Button>
                  <Button 
                    variant={settings.appearance.theme === "system" ? "default" : "outline"}
                    className="flex flex-col items-center justify-center gap-1 h-20"
                    onClick={() => handleSettingChange("appearance", "theme", "system")}
                  >
                    <Laptop className="h-5 w-5" />
                    <span className="text-xs">System</span>
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Font Size</Label>
                <Select 
                  value={settings.appearance.fontSize}
                  onValueChange={(value) => handleSettingChange("appearance", "fontSize", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a font size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="reduced-motion">Reduced Motion</Label>
                    <p className="text-sm text-muted-foreground">
                      Reduce the motion of animations
                    </p>
                  </div>
                  <Switch
                    id="reduced-motion"
                    checked={settings.appearance.reducedMotion}
                    onCheckedChange={(checked) => handleSettingChange("appearance", "reducedMotion", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="reduced-branding">Reduced Branding</Label>
                    <p className="text-sm text-muted-foreground">
                      Use simpler visuals with less decorative elements
                    </p>
                  </div>
                  <Switch
                    id="reduced-branding"
                    checked={settings.appearance.reducedBranding}
                    onCheckedChange={(checked) => handleSettingChange("appearance", "reducedBranding", checked)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveSettings} 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Account Tab */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences and language settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select 
                  value={settings.language}
                  onValueChange={(value) => setSettings({...settings, language: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="vi">Vietnamese</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                    <SelectItem value="ko">Korean</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Connected Devices</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Devices that are currently logged into your account
                </p>
                
                <div className="space-y-4">
                  {settings.devices.map((device) => (
                    <div 
                      key={device.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {device.name.includes("iPhone") || device.name.includes("Android") ? (
                            <Smartphone className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <Laptop className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium flex items-center">
                            {device.name}
                            {device.isCurrent && (
                              <span className="ml-2 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2 py-0.5 rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Last active: {device.lastActive}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Location: {device.location}
                          </div>
                        </div>
                      </div>
                      
                      {!device.isCurrent && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-500">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Device</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove this device? This will log out the device from your account.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600"
                                onClick={() => handleRemoveDevice(device.id)}
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Danger Zone</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Permanent actions that affect your account
                </p>
                
                <div className="flex flex-col space-y-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Account</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-500 hover:bg-red-600">
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveSettings} 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Decide how and when you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-course-updates">Course Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        New lessons, content updates, and announcements
                      </p>
                    </div>
                    <Switch
                      id="email-course-updates"
                      checked={settings.notifications.email.courseUpdates}
                      onCheckedChange={(checked) => handleSettingChange("notifications", "email.courseUpdates", checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-messages">Messages</Label>
                      <p className="text-sm text-muted-foreground">
                        Direct messages from instructors and students
                      </p>
                    </div>
                    <Switch
                      id="email-messages"
                      checked={settings.notifications.email.messages}
                      onCheckedChange={(checked) => handleSettingChange("notifications", "email.messages", checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-marketing-offers">Marketing Offers</Label>
                      <p className="text-sm text-muted-foreground">
                        Promotions, discounts, and new course recommendations
                      </p>
                    </div>
                    <Switch
                      id="email-marketing-offers"
                      checked={settings.notifications.email.marketingOffers}
                      onCheckedChange={(checked) => handleSettingChange("notifications", "email.marketingOffers", checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-account-notices">Account Notices</Label>
                      <p className="text-sm text-muted-foreground">
                        Security alerts, payment confirmations, and account-related updates
                      </p>
                    </div>
                    <Switch
                      id="email-account-notices"
                      checked={settings.notifications.email.accountNotices}
                      onCheckedChange={(checked) => handleSettingChange("notifications", "email.accountNotices", checked)}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Push Notifications</h3>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-course-updates">Course Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        New lessons, content updates, and announcements
                      </p>
                    </div>
                    <Switch
                      id="push-course-updates"
                      checked={settings.notifications.push.courseUpdates}
                      onCheckedChange={(checked) => handleSettingChange("notifications", "push.courseUpdates", checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-messages">Messages</Label>
                      <p className="text-sm text-muted-foreground">
                        Direct messages from instructors and students
                      </p>
                    </div>
                    <Switch
                      id="push-messages"
                      checked={settings.notifications.push.messages}
                      onCheckedChange={(checked) => handleSettingChange("notifications", "push.messages", checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-marketing-offers">Marketing Offers</Label>
                      <p className="text-sm text-muted-foreground">
                        Promotions, discounts, and new course recommendations
                      </p>
                    </div>
                    <Switch
                      id="push-marketing-offers"
                      checked={settings.notifications.push.marketingOffers}
                      onCheckedChange={(checked) => handleSettingChange("notifications", "push.marketingOffers", checked)}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-account-notices">Account Notices</Label>
                      <p className="text-sm text-muted-foreground">
                        Security alerts, payment confirmations, and account-related updates
                      </p>
                    </div>
                    <Switch
                      id="push-account-notices"
                      checked={settings.notifications.push.accountNotices}
                      onCheckedChange={(checked) => handleSettingChange("notifications", "push.accountNotices", checked)}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Frequency</h3>
                <RadioGroup 
                  value={settings.notifications.frequency}
                  onValueChange={(value) => handleSettingChange("notifications", "frequency", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="immediately" id="immediately" />
                    <Label htmlFor="immediately">Immediately</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="daily" id="daily" />
                    <Label htmlFor="daily">Daily digest</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekly" id="weekly" />
                    <Label htmlFor="weekly">Weekly summary</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveSettings} 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Privacy Tab */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control your privacy and data preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Profile Visibility</Label>
                <Select 
                  value={settings.privacy.profileVisibility}
                  onValueChange={(value) => handleSettingChange("privacy", "profileVisibility", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public - Anyone can view</SelectItem>
                    <SelectItem value="private">Private - Only you</SelectItem>
                    <SelectItem value="enrolled">Enrolled Students Only</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  This determines who can see your profile information
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-course-progress">Show Course Progress</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow others to see your progress in courses
                    </p>
                  </div>
                  <Switch
                    id="show-course-progress"
                    checked={settings.privacy.showCourseProgress}
                    onCheckedChange={(checked) => handleSettingChange("privacy", "showCourseProgress", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-last-seen">Show Last Seen</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow others to see when you were last active
                    </p>
                  </div>
                  <Switch
                    id="show-last-seen"
                    checked={settings.privacy.showLastSeen}
                    onCheckedChange={(checked) => handleSettingChange("privacy", "showLastSeen", checked)}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Data & Analytics</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allow-data-collection">Data Collection</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow us to collect anonymous usage data to improve the service
                    </p>
                  </div>
                  <Switch
                    id="allow-data-collection"
                    checked={settings.privacy.allowDataCollection}
                    onCheckedChange={(checked) => handleSettingChange("privacy", "allowDataCollection", checked)}
                  />
                </div>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-md p-4">
                <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300 flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy Policy
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                  We value your privacy and are committed to maintaining the confidentiality of your personal information. Please review our
                  <a 
                    href="/privacy" 
                    className="text-amber-900 dark:text-amber-300 underline ml-1"
                  >
                    privacy policy
                  </a>
                  .
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveSettings} 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 