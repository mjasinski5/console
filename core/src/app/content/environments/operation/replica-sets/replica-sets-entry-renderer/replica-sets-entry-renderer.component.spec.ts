import { APP_BASE_HREF } from '@angular/common';
import { AppModule } from './../../../../../app.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReplicaSetsEntryRendererComponent } from './replica-sets-entry-renderer.component';
import { ComponentCommunicationService } from '../../../../../shared/services/component-communication.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

describe('ReplicaSetsEntryRendererComponent', () => {
  let component: ReplicaSetsEntryRendererComponent;
  let fixture: ComponentFixture<ReplicaSetsEntryRendererComponent>;
  let componentCommunicationService: ComponentCommunicationService;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [AppModule],
        providers: [
          [{ provide: APP_BASE_HREF, useValue: '/my/app' }],
          [
            {
              provide: 'entry',
              useValue: {
                objectMeta: {
                  name: 'name'
                },
                pods: {
                  warnings: [],
                  pending: []
                }
              }
            }
          ],
          [{ provide: 'entryEventHandler', useValue: {} }],
          ComponentCommunicationService
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplicaSetsEntryRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    componentCommunicationService = TestBed.get(ComponentCommunicationService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should disable the replica set if 'disable' event with rigth data has been sent", async () => {
    fixture.detectChanges();
    const subject = new Subject();
    const entry = {
      objectMeta: {
        name: 'name'
      },
      disabled: true
    };
    spyOn(componentCommunicationService, 'observable$').and.returnValue(
      Observable.of(subject.next(entry))
    );
    expect(component.disabled).toEqual(false);
    fixture.whenStable().then(async () => {
      fixture.detectChanges();
      await componentCommunicationService.sendEvent({
        type: 'disable',
        entry
      });
      expect(component.disabled).toEqual(true);
    });
  });

  it("should not disable the replica set if 'disable' event with different data has been sent", async () => {
    fixture.detectChanges();
    const subject = new Subject();
    const entry = {
      objectMeta: {
        name: 'name2'
      },
      disabled: true
    };
    spyOn(componentCommunicationService, 'observable$').and.returnValue(
      Observable.of(subject.next(entry))
    );
    expect(component.disabled).toEqual(false);
    fixture.whenStable().then(async () => {
      fixture.detectChanges();
      await componentCommunicationService.sendEvent({
        type: 'disable',
        entry
      });
      expect(component.disabled).toEqual(false);
    });
  });

  it("should not disable the replica set if event type is no 'disable'", async () => {
    fixture.detectChanges();
    const subject = new Subject();
    const entry = {
      objectMeta: {
        name: 'name'
      },
      disabled: false
    };
    spyOn(componentCommunicationService, 'observable$').and.returnValue(
      Observable.of(subject.next(entry))
    );
    expect(component.disabled).toEqual(false);
    fixture.whenStable().then(async () => {
      fixture.detectChanges();
      await componentCommunicationService.sendEvent({
        type: 'diffetentType',
        entry
      });
      expect(component.disabled).toEqual(false);
    });
  });
});
