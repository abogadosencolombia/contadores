"use client";
import React, { useEffect, useState } from "react";
import Switch from "../form/switch/Switch";
import { getPreferences, updatePreference } from "@/lib/privacyService";
import { Preference } from "@/types/privacy";

export default function UserConsentsCard() {
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const data = await getPreferences();
        setPreferences(data);
      } catch (error) {
        console.error("Failed to load preferences:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPreferences();
  }, []);

  const handleToggle = async (channel: string, purpose: string, checked: boolean) => {
    // Optimistic update
    const oldPreferences = [...preferences];
    const existingPrefIndex = preferences.findIndex(
      (p) => p.canal === channel && p.finalidad === purpose
    );

    let newPreferences;
    if (existingPrefIndex !== -1) {
      newPreferences = [...preferences];
      newPreferences[existingPrefIndex] = { ...newPreferences[existingPrefIndex], autorizado: checked };
    } else {
        // Mock ID for optimistic update, backend will return real one
      newPreferences = [...preferences, { 
          id: Date.now(), 
          canal: channel as Preference['canal'], 
          finalidad: purpose as Preference['finalidad'], 
          autorizado: checked 
      }];
    }
    setPreferences(newPreferences);

    try {
      // Send partial preference, backend should handle upsert based on channel+purpose
      await updatePreference({ 
          canal: channel as Preference['canal'], 
          finalidad: purpose as Preference['finalidad'], 
          autorizado: checked 
      });
      // Ideally, re-fetch to get the real ID if created, but for toggling visual state, this is enough.
      // Or better: updatePreference returns the saved object, so we could update state with that.
    } catch (error) {
      console.error("Failed to update preference:", error);
      // Revert on error
      setPreferences(oldPreferences);
    }
  };

  const channels = ["EMAIL", "TELEFONO", "WHATSAPP"] as const;
  const purposes = ["MARKETING", "FINANCIERO", "IA"] as const;

  const getPreference = (channel: string, purpose: string) => {
    return preferences.find(
      (p) => p.canal === channel && p.finalidad === purpose
    );
  };

  if (loading) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded dark:bg-gray-700 w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-1/2 mb-8"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded dark:bg-gray-700 w-full"></div>
            <div className="h-10 bg-gray-200 rounded dark:bg-gray-700 w-full"></div>
            <div className="h-10 bg-gray-200 rounded dark:bg-gray-700 w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between mb-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Gestión de Privacidad
          </h4>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Controla de forma granular cómo utilizamos tus datos y por qué canales te contactamos.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-4 border-b border-gray-200 dark:border-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400">
                Canal / Finalidad
              </th>
              {purposes.map((purpose) => (
                <th
                  key={purpose}
                  className="p-4 border-b border-gray-200 dark:border-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 text-center"
                >
                  {purpose}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {channels.map((channel) => (
              <tr key={channel} className="group hover:bg-gray-50 dark:hover:bg-white/[0.03]">
                <td className="p-4 border-b border-gray-200 dark:border-gray-800 text-sm font-medium text-gray-800 dark:text-white/90">
                  {channel}
                </td>
                {purposes.map((purpose) => {
                  const pref = getPreference(channel, purpose);
                  const isChecked = pref ? pref.autorizado : false;
                  return (
                    <td
                      key={`${channel}-${purpose}`}
                      className="p-4 border-b border-gray-200 dark:border-gray-800 text-center"
                    >
                      <div className="flex justify-center">
                        <Switch
                          label=""
                          defaultChecked={isChecked}
                          onChange={(checked) => handleToggle(channel, purpose, checked)}
                        />
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
