"use strict";

(function() {

    angular
        .module("firebotApp")
        .component("overlaySettings", {
            template: `
                <div>

                    <firebot-setting
                        name="Overlay URL"
                        description="Open the Overlay Setup modal to get access to the url and how to set it up."
                    >
                        <firebot-button
                            text="Get Overlay Path"
                            ng-click="settings.showOverlayInfoModal()"
                        />
                    </firebot-setting>

                    <firebot-setting
                        name="Overlay Instances"
                        description="Enable or disable the ability to use multiple overlay instances in your broadcasting software. When on, you will be able to pick which instance you want a video or image effect to show in. This is useful if you use greenscreen footage that you need to chroma key but don't want to affect your other videos and images."
                    >
                        <span
                            style="padding-right: 10px"
                            ng-if="settings.useOverlayInstances()"
                        >
                            <a href ng-click="showEditOverlayInstancesModal()">Edit Instances</a>
                        </span>
                        <firebot-select
                            options="{ true: 'On', false: 'Off' }"
                            ng-init="overlayInstances = settings.useOverlayInstances()"
                            selected="overlayInstances"
                            on-update="settings.setUseOverlayInstances(option === 'true')"
                            right-justify="true"
                        />
                    </firebot-setting>

                    <firebot-setting
                        name="Font Management"
                        description="Manage fonts for use with the Show Text effect in the overlay. Any changes to fonts will require a restart to Firebot and then refreshing the overlay."
                    >
                        <firebot-button
                            text="Manage Fonts"
                            ng-click="showFontManagementModal()"
                        />
                    </firebot-setting>

                </div>
          `,
            controller: function($scope, settingsService, utilityService) {
                $scope.settings = settingsService;

                $scope.showFontManagementModal = function() {
                    utilityService.showModal({
                        component: "fontManagementModal",
                        size: "sm"
                    });
                };

                $scope.showEditOverlayInstancesModal = function() {
                    utilityService.showModal({
                        component: "editOverlayInstancesModal"
                    });
                };
            }
        });
}());
