exports.register = function(module) {
    module
        .controller('setController', [
            '$scope',
            '$activeDatabase',
            '$redisRepositoryFactory',
            'redisRepo',
            '$redisScannerFactory',
            '$actionBarItems',
            '$dialogViewModel',
            '$confirmViewModel',
            '$notifyViewModel',
            '$redisSettings',
            '$busyIndicator',
            '$messageBus',
            '$validator',
            'uiGridConstants',
            'dialog',
            function(
                $scope,
                $activeDatabase,
                $redisRepositoryFactory,
                redisRepo,
                $redisScannerFactory,
                $actionBarItems,
                $dialogViewModel,
                $confirmViewModel,
                $notifyViewModel,
                $redisSettings,
                $busyIndicator,
                $messageBus,
                $validator,
                uiGridConstants,
                dialog) {
                var self = this;
                var repo = $redisRepositoryFactory('set');

                // properties
                $scope.setApi = null;
                $scope.memberForEdit = null;
                $scope.setOptions = {
                    enableSorting: true,
                    columnDefs: [{
                        name: 'Value',
                        field: 'Value',
                        width: '*'
                    }],
                    rowHeight: 18,
                    data: [],
                    enableRowSelection: true,
                    enableSelectAll: false,
                    enableFullRowSelection: true,
                    enableRowHeaderSelection: false,
                    multiSelect: false,
                    enableColumnMenus: false,
                    selectedItems: [],
                    enableColumnResizing: true,
                    onRegisterApi: function(gridApi) {
                        $scope.setApi = gridApi;
                        $scope.setApi.selection.on.rowSelectionChanged($scope, function(row) {
                            $scope.memberForEdit = {
                                Value: row.entity.Value
                            };
                            $scope.setOptions.selectedItems = [row.entity];
                        });
                        gridApi.selection.on.rowSelectionChangedBatch($scope, function(rows) {
                            $scope.setOptions.selectedItems.length = 0;
                            for (var i = 0; i < rows.length; i++) {
                                $scope.setOptions.selectedItems.push(rows[i].entity);
                            };
                        });
                    },
                    getStyle: function() {
                        return {
                            height: '100%'
                        };
                    }
                };

                // commands
                self.update = function(key, oldMember, newMember, cb) {
                    cb = cb ? cb : function() {};
                    repo.update(key, newMember.Name, newMember, oldMember.Value, cb);
                };

                // init
                $scope.$on('redisViewModel-key-selected-type-set', function(event, result) {
                    var data = result.Value;
                    var set = [];
                    for (var i = 0; i < data.length; i++) {
                        set.push({
                            Value: data[i]
                        });
                    };

                    $scope.setOptions.data = set;
                });

                $scope.$on('redisViewModel-save-set', function(event, key) {
                    var selectedMember = $scope.setOptions.selectedItems.length > 0 ? $scope.setOptions.selectedItems[0] : null;
                    if (selectedMember == null) return;

                    $scope.update(
                        key,
                        $scope.memberForEdit,
                        selectedMember);
                });
            }
        ]);
};