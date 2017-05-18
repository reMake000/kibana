import { VisTypeProvider } from 'ui/vis/vis_types';

export function AngularVisTypeProvider(Private, $compile, $rootScope) {
  const VisType = Private(VisTypeProvider);

  class AngularVisType extends VisType {
    constructor(opts) {
      super(opts);

      this.visConfig.template = opts.visConfig ? opts.visConfig.template : opts.template;
      if (!this.visConfig.template) {
        throw new Error('Missing template for AngularVisType');
      }
    }

    render(vis, $el, uiState, esResponse) {
      return new Promise((resolve, reject) => {
        const updateScope = () => {
          this.$scope.vis = vis.clone();
          this.$scope.esResponse = esResponse;
          this.$scope.renderComplete = resolve;
          this.$scope.renderFailed = reject;
        };

        if (!this.$scope) {
          this.$scope = $rootScope.$new();
          updateScope();
          this.$scope.uiState = uiState;
          $el.html($compile(vis.type.visConfig.template)(this.$scope));
        } else {
          updateScope();
        }
      });
    }

    destroy() {
      this.$scope.$destroy();
      this.$scope = null;
    }
  }

  return AngularVisType;
}